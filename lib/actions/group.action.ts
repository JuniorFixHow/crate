'use server'
import { isEligible } from "@/functions/misc";
import Group, { IGroup } from "../database/models/group.model";
import Member, { IMember } from "../database/models/member.model";
import Registration from "../database/models/registration.model";
import Room from "../database/models/room.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";
import '../database/models/venue.model';
import '../database/models/event.model';
import '../database/models/church.model';

export async function createGroup(group: Partial<IGroup>) {
    try {
        await connectDB();

        // Find the most recent group based on group number, in descending order
        const lastGroup = await Group.findOne().sort({ groupNumber: -1 });

        // Calculate the next group number
        const nextGroupNumber = lastGroup?.groupNumber ? lastGroup.groupNumber + 1 : 1;

        const { members, eventId } = group;

        // Default eligible count to zero
        let eligibleCount = 0;

        if (members && members.length > 0) {
            // Fetch member details to determine eligibility
            const memberDetails = await Member.find({ _id: { $in: members } });

            // Calculate eligible members based on age group
            eligibleCount = memberDetails.reduce( (count, member) => {
                const eligible = isEligible(member.ageRange)
                if (eligible) {
                    return count + 1;
                }
                return count;
            }, 0);
        }


        // Create a new group with the eligible count
        const newGroup = new Group({
            ...group,
            groupNumber: nextGroupNumber,
            eligible: eligibleCount,
        });

        // Save the new group
        await newGroup.save();

        // Assign the group to all members involved in the group (via their registrations) for the specific event
        if (members && members.length > 0 && eventId) {
            await Registration.updateMany(
                {
                    memberId: { $in: members }, // Find all registrations that match the member IDs
                    eventId: eventId,          // Ensure the registration belongs to the specific event
                },
                {
                    $set: { groupId: newGroup._id }, // Assign the new group ID to those registrations
                }
            );
        }

        return handleResponse('Group created successfully and assigned to members', false, newGroup, 201);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating group:', error.message);
            throw new Error(`Error occurred during group creation: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during group creation');
        }
    }
}




export async function updateGroup (id:string, group:Partial<IGroup>){
    try {
        await connectDB();
        const {type} = group;
        const g = await Group.findById(id);
        // console.log(g.eligible)
        if(!g){
            return handleResponse('Group not found', true);
        }
        if(type === 'Couple' && g.eligible > 2){
            return handleResponse(`You can't update a group of ${g.eligible} to 'Couple'`, true);
        }else{
            const grp = await Group.findByIdAndUpdate(id, group, {new:true});
            return handleResponse(`Group updated successfully`, false, grp, 201);
        }
        
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating group:', error.message);
            throw new Error(`Error occurred during group update: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during group update');
        }
    }
}


export async function getGroupForMember(eventId: string, memberId: string) {
    try {
        await connectDB();
        
        // Find the group where the member is in the members array and the eventId matches
        const group = await Group.findOne({ 
            eventId, 
            members: { $elemMatch: { $eq: memberId } } // Explicitly checking if memberId exists in members array
        }).populate('eventId').populate('members').lean();
        
        if (!group) {
            throw new Error('Group not found for the specified member and event');
        }

        return JSON.parse(JSON.stringify(group));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching group for the member:', error.message);
            throw new Error(`Error occurred while fetching the group for the member: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while fetching the group for the member');
        }
    }
}






export async function addMemberToGroup(groupId: string, memberId: string, eventId: string) {
    try {
        await connectDB();

        // Check if the member is already in a group for the event
        const existingRegistration = await Registration.findOne({ memberId, eventId });
        if (existingRegistration && existingRegistration.groupId) {
            return handleResponse('Member is already assigned to a group for this event', true, {}, 403);
        }

        // Find the group and validate existence
        const group = await Group.findById(groupId).populate('members');
        if (!group) {
            return handleResponse('Group not found', true, {}, 404);
        }

        // Fetch member details
        const member = await Member.findById(memberId);
        if (!member) {
            return handleResponse('Member not found', true, {}, 404);
        }

        // Determine if the member is eligible based on their age group
        const isMemberEligible = isEligible(member.ageRange);

        // Validate group type "Couple" capacity (2 members max based on eligibility)
        if (group.type === 'Couple' && group.eligible >= 2 && isMemberEligible) {
            return handleResponse('Couple groups can only have 2 members', true, {}, 403);
        }

        // Get roomIds assigned to the group from eligible members only
        // Filter the members based on eligibility
        const eligibleMembers = group.members.filter((member:IMember) => isEligible(member.ageRange));

        // Now find the registrations for the eligible members
        const eligibleMemberRegistrations = await Registration.find({
            groupId: group._id,
            memberId: { $in: eligibleMembers.map((m:IMember) => m._id) }
        });
        const groupRoomIds = eligibleMemberRegistrations.length > 0 ? eligibleMemberRegistrations[0].roomIds : [];

        // Check if any roomIds are assigned
        if (groupRoomIds.length > 0) {
            // Sum the nob (beds) of all rooms assigned to the eligible group members
            let totalBedsAvailable = 0;
            for (const roomId of groupRoomIds) {
                const room = await Room.findById(roomId);
                if (room) {
                    totalBedsAvailable += room.nob; // Add the number of beds in each room
                } else {
                    return handleResponse(`Room with ID ${roomId} not found`, true, {}, 404);
                }
            }

            // Check if the total available beds are enough to accommodate eligible members
            const totalEligibleMembers = group.eligible + 1; // Include the new eligible member being added (if eligible)

            if (totalBedsAvailable < totalEligibleMembers) {
                return handleResponse(
                    'Not enough available beds to accommodate the new eligible member in the group.',
                    true,
                    {},
                    403
                );
            }
        }

        

        // If member already had a room assigned, remove the room and assign the group rooms
        if (existingRegistration && existingRegistration.roomIds?.length > 0) {
            await Registration.findByIdAndUpdate(existingRegistration._id, {
                $set: { roomIds: [] }, // Remove current room assignments
            });
        }

        // Update group's eligible count if the new member is eligible
        if (isMemberEligible) {
            group.eligible = (group.eligible || 0) + 1;
        }

        // Assign the group's roomIds to the member's registration if they are eligible
        const roomIdsToAssign = isMemberEligible ? groupRoomIds : [];

        // Assign member to group's rooms and groupId
        await Registration.findOneAndUpdate(
            { memberId, eventId },
            { roomIds: roomIdsToAssign, groupId },
            { new: true, upsert: true } // Add member to group and reassign rooms
        );

        // Add member to group's member list
        if (!group.members.includes(memberId)) {
            group.members.push(memberId);
            await group.save();
        }

        return handleResponse('Member added successfully', false, group, 201);
    } catch (error) {
        console.error('Error adding member to group:', error instanceof Error ? error.message : error);
        throw new Error(`Error occurred while adding member to group`);
    }
}







export async function removeMemberFromGroup(groupId: string, memberId: string, eventId: string) {
    try {
        await connectDB();

        // Find the group and check if it exists
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        // Check if the member is in the group
        if (!group.members.includes(memberId)) {
            throw new Error('Member is not in the group');
        }

        // Fetch member details to check eligibility
        const member = await Member.findById(memberId);
        if (!member) {
            throw new Error('Member not found');
        }

        // Check if the member is eligible and decrement the eligible count if needed
        const isMemberEligible = isEligible(member.ageRange);
        if (isMemberEligible && group.eligible > 0) {
            group.eligible -= 1;
        }

        // Remove the member from the group's members array (using $pull to update in one step)
        await group.updateOne({ $pull: { members: memberId } });

        // Save the updated group with the new eligible count
        await group.save();

        // Update the member's registration to remove the group assignment
        const memberRegistration = await Registration.findOneAndUpdate(
            { memberId, eventId },
            { $unset: { groupId: '' } },
            { new: true }
        );

        if (!memberRegistration) {
            throw new Error('Member registration not found');
        }

        // Remove room assignments from the member's registration (if any)
        if (memberRegistration.roomIds?.length) {
            await Registration.findByIdAndUpdate(memberRegistration._id, {
                $set: { roomIds: [] }, // Remove room assignments
            });
        }

        return handleResponse('Member removed successfully', false, group, 201); // Return the updated group
    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse('Error occurred while removing member from group', true, {}, 500);
    }
}


export async function removeMemberFromAllGroups(memberId: string) {
    try {
        await connectDB();

        // Fetch all groups where this member is present
        const groups = await Group.find({ members: memberId });

        if (!groups.length) {
            throw new Error('Member is not in any group');
        }

        // Fetch member details to check eligibility
        const member = await Member.findById(memberId);
        if (!member) {
            throw new Error('Member not found');
        }

        // Iterate over all groups and remove the member
        for (const group of groups) {
            // Check if the member is eligible and decrement the eligible count if needed
            const isMemberEligible = isEligible(member.ageRange);
            if (isMemberEligible && group.eligible > 0) {
                group.eligible -= 1;
            }

            // Remove the member from the group's members array
            await group.updateOne({ $pull: { members: memberId } });

            // Save the updated group with the new eligible count
            await group.save();
        }

        // Update all registrations where the member is assigned to a group
        await Registration.updateMany(
            { memberId },
            { $unset: { groupId: '', roomIds: [] } } // Remove group and room assignments
        );

        return { message: `Member removed from ${groups.length} groups across all events` };
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error removing member from all groups:', error.message);
            throw new Error(`Error occurred while removing member from all groups: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while removing member from all groups');
        }
    }
}


export async function removeMemberFromGroupBeforeDeletion(memberId: string, eventId: string) {
    try {
        await connectDB();

        // Find the member's registration to check if they have a group
        const memberRegistration = await Registration.findOne({ memberId, eventId });

        // If no registration found, return early and allow deletion to continue
        if (!memberRegistration) {
            console.log('Member registration not found, skipping group removal');
            return;
        }

        // If the member has no assigned group, return early and allow deletion to continue
        if (!memberRegistration.groupId) {
            console.log('Member is not assigned to any group, skipping group removal');
            return;
        }

        // Find the group
        const group = await Group.findById(memberRegistration.groupId);
        if (!group) {
            console.log('Group not found, skipping group removal');
            return;
        }

        // Remove the member from the group
        await group.updateOne({ $pull: { members: memberId } });

        // Adjust the eligible count if necessary
        const member = await Member.findById(memberId);
        if (member && isEligible(member.ageRange) && group.eligible > 0) {
            group.eligible -= 1;
            await group.save();
        }

        console.log(`Successfully removed member ${memberId} from group ${group._id}`);
    } catch (error) {
        console.error('Error occurred while removing member from group:', error);
        // Do not throw the error so the registration deletion can continue
    }
}



export async function removeMemberFromAllGroupsBeforeDeletion(memberId: string) {
    try {
        await connectDB();

        // Fetch all registrations of the member (across all events)
        const registrations = await Registration.find({ memberId });

        if (!registrations.length) {
            console.log(`No registrations found for member ${memberId}, skipping group removal.`);
            return;
        }

        for (const registration of registrations) {
            // Check if the registration has a group
            if (!registration.groupId) {
                console.log(`Member ${memberId} is not assigned to a group for event ${registration.eventId}, skipping.`);
                continue;
            }

            // Find the group
            const group = await Group.findById(registration.groupId);
            if (!group) {
                console.log(`Group ${registration.groupId} not found, skipping.`);
                continue;
            }

            // Remove the member from the group's members list
            await group.updateOne({ $pull: { members: memberId } });

            // Decrement eligible count if applicable
            const member = await Member.findById(memberId);
            if (member && isEligible(member.ageRange) && group.eligible > 0) {
                group.eligible -= 1;
            }

            // Save the updated group
            await group.save();

            console.log(`Removed member ${memberId} from group ${group._id}`);
        }

        // Update all registrations to remove group references
        await Registration.updateMany(
            { memberId },
            { $unset: { groupId: "", roomIds: [] } } // Remove group and room assignments
        );

        console.log(`All group references removed for member ${memberId}`);
        
    } catch (error) {
        console.error("Error occurred while removing member from all groups:", error);
    }
}




export async function getGroups() {
    try {
        await connectDB();
        const groups = await Group.find()
            .populate('members')     
            .populate('roomIds')
            .populate('churchId')
            .lean();
            // console.log('Groups: ', groups);
        return JSON.parse(JSON.stringify(groups));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching groups:', error.message);
            throw new Error(`Error occurred during groups fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during groups fetch');
        }
    }
}

export async function getEventGroups(eventId:string) {
    try {
        await connectDB();
        const groups = await Group.find({eventId})
            .populate('eventId')     // Populate the single event reference
            .populate('members')     // Populate array of members
            .populate({
                path:'roomIds',
                populate:{
                    path:'venueId',
                    model:'Venue'
                }
            })     // Populate array of rooms
            .populate({
                path:'churchId',
                populate:{
                    path:'zoneId',
                    model:'Zone'
                }
            })     // Populate array of rooms
            .lean();
        return JSON.parse(JSON.stringify(groups));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching groups:', error.message);
            throw new Error(`Error occurred during groups fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during groups fetch');
        }
    }
}

export async function getOptionalEventGroups(eventId?:string) {
    try {
        await connectDB();
        const groups = await Group.find(eventId ? {eventId}:{})
            .populate('members')     // Populate array of members
            .populate('roomIds')     // Populate array of rooms
            .populate('churchId')     // Populate array of church
            .lean();
        return JSON.parse(JSON.stringify(groups));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching groups:', error.message);
            throw new Error(`Error occurred during groups fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during groups fetch');
        }
    }
}



export async function getRegistrationsForGroup(groupId: string) {
    try {
        await connectDB();

        // Find the group to get the associated eventId
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        const eventId = group.eventId;
        if (!eventId) {
            throw new Error('Event ID not associated with this group');
        }

        // Fetch all registrations for this group and event
        const registrations = await Registration.find({
            groupId: groupId,
            eventId: eventId
        })
        .populate('memberId')
        .lean();

        return handleResponse('Registrations fetched successfully', false, registrations, 200);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching registrations for group:', error.message);
            throw new Error(`Error occurred while fetching registrations: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while fetching registrations');
        }
    }
}




export async function getGroup(id:string){
    try {
        await connectDB();
        const group = await Group.findById(id)
            .populate('eventId')     // Populate the single event reference
            .populate('members')     // Populate array of members
            .populate('roomIds')     // Populate array of rooms
            .populate('churchId')     // Populate array of church
            .lean();
        return JSON.parse(JSON.stringify(group));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching group:', error.message);
            throw new Error(`Error occurred during group fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during group fetch');
        }
    }
}




export async function deleteGroup(id: string) {
    try {
        await connectDB();

        // Find the group by its ID
        const group = await Group.findById(id);
        if (!group) {
            return handleResponse('Group not found', true, {}, 404);
        }

        // Remove the group reference and roomIds from all associated registrations
        await Registration.updateMany(
            { groupId: group._id },
            { 
                $unset: { groupId: '' },  // Remove the group reference
                $set: { roomIds: [] }     // Clear roomIds
            }
        );

        // Clear roomIds from the group
        group.roomIds = [];
        await group.save();

        // Delete the group itself
        await Group.findByIdAndDelete(group._id);

        return handleResponse('Group deleted successfully', false, group, 201);
    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse('Error occurred during group deletion', true, {}, 500);
    }
}


