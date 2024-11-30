'use server'
import Group, { IGroup } from "../database/models/group.model";
import Registration from "../database/models/registration.model";
import Room from "../database/models/room.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createGroup(group: Partial<IGroup>) {
    try {
        await connectDB();

        // Find the most recent group based on group number, in descending order
        const lastGroup = await Group.findOne().sort({ groupNumber: -1 });

        // Calculate the next group number
        const nextGroupNumber = lastGroup?.groupNumber ? lastGroup.groupNumber + 1 : 1;

        // Assign the calculated group number to the new group
        const newGroup = new Group({
            ...group,
            groupNumber: nextGroupNumber
        });

        // Save the new group
        await newGroup.save();

        // Ensure the eventId is part of the group data
        const { eventId, members } = group;

        // Assign the group to all members involved in the group (via their registrations) for the specific event
        if (members && members.length > 0 && eventId) {
            await Registration.updateMany(
                { 
                    memberId: { $in: members },  // Find all registrations that match the member IDs
                    eventId: eventId              // Ensure the registration belongs to the specific event
                },
                { 
                    $set: { groupId: newGroup._id }    // Assign the new group ID to those registrations
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
        const grp = await Group.findByIdAndUpdate(id, group, {new:true});
        return JSON.parse(JSON.stringify(grp));
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

        // Find the group to ensure it exists and validate its type
        const group = await Group.findById(groupId).populate('members');
        if (!group) {
            return handleResponse('Group not found', true, {}, 404);
        }

        // Check if the group type is "Couple" and restrict to 2 members
        if (group.type === 'Couple' && group.members.length >= 2) {
            return handleResponse('Couple groups can only have 2 members', true, {}, 403);
        }

        // Retrieve the registrations of members in the group to check room assignments
        const groupRegistrations = await Registration.find({ groupId: group._id });

        // **NEW CHECK**: Skip room capacity validation if no rooms are assigned
        const roomIds = [...new Set(groupRegistrations.flatMap((registration) => registration.roomIds))];

        if (roomIds.length > 0) {
            // Perform the room occupancy check only if there are roomIds
            const roomOccupancyCheck = await Promise.all(
                roomIds.map(async (roomId: string) => {
                    const room = await Room.findById(roomId);
                    if (room) {
                        const currentRoomCount = await Registration.countDocuments({ roomIds: roomId });
                        return currentRoomCount >= room.nob; // True if room is full
                    }
                    return false; // Room is not full or does not exist
                })
            );

            // Determine if all checked rooms are full
            const allRoomsFull = roomOccupancyCheck.every((isFull) => isFull);
            if (allRoomsFull) {
                return handleResponse(
                    'All rooms occupied by the group are full. Please add more rooms to accommodate additional members.',
                    true,
                    {},
                    403
                );
            }
        }

        // If the member has existing room assignments, clear them
        if (existingRegistration && existingRegistration.roomIds.length > 0) {
            await Registration.findByIdAndUpdate(existingRegistration._id, {
                $set: { roomIds: [] }
            });
        }

        // Assign the member to the rooms occupied by the group
        const groupRoomIds = roomIds; // Use the current group roomIds
        if (groupRoomIds.length > 0) {
            await Registration.findOneAndUpdate(
                { memberId, eventId },
                { roomIds: groupRoomIds, groupId },
                { new: true, upsert: true } // upsert: true will create the registration if it does not exist
            );
        } else {
            // Update the member's registration to assign them to the new group without room assignment
            await Registration.findOneAndUpdate(
                { memberId, eventId },
                { groupId },
                { new: true, upsert: true }
            );
        }

        // Add the member to the group's members array if not already there
        if (!group.members.includes(memberId)) {
            group.members.push(memberId);
            await group.save();
        }

        return handleResponse('Member added successfully', false, group, 201);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding member to group:', error.message);
            throw new Error(`Error occurred while adding member to group: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while adding member to group');
        }
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

        // Remove the member from the group's members array (using $pull to update in one step)
        await group.updateOne({ $pull: { members: memberId } });

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

        return JSON.parse(JSON.stringify(group)); // Return the updated group
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error removing member from group:', error.message);
            throw new Error(`Error occurred while removing member from group: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while removing member from group');
        }
    }
}





export async function getGroups() {
    try {
        await connectDB();
        const groups = await Group.find()
            .populate('members')     // Populate array of members
            .populate('roomIds')     // Populate array of rooms
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
            .populate('roomIds')     // Populate array of rooms
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
            throw new Error('Group not found');
        }

        // Remove the group reference from all registrations
        await Registration.updateMany(
            { groupId: group._id },  // Find all registrations that reference this group
            { $unset: { groupId: "" } } // Remove the group reference (unset)
        );

        // Delete the group itself
        await Group.findByIdAndDelete(group._id);

        return handleResponse('Group deleted successfully', false, group, 201);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting group:', error.message);
            throw new Error(`Error occurred during group deletion: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during group deletion');
        }
    }
}

