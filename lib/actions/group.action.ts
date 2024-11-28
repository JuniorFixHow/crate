'use server'
import Event from "../database/models/event.model";
import Group, { IGroup } from "../database/models/group.model";
import Registration from "../database/models/registration.model";
import Room from "../database/models/room.model";
import { connectDB } from "../database/mongoose";

export async function createGroup(group:IGroup){
    try {
        await connectDB();
        const newGroup = await Event.create(group);
        return JSON.parse(JSON.stringify(newGroup));
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

export async function updateGroup (id:string, group:IGroup){
    try {
        await connectDB();
        const grp = await Event.findByIdAndUpdate(id, group, {new:true});
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
            throw new Error('Member is already assigned to a group for this event');
        }

        // Find the group to ensure it exists and validate its type
        const group = await Group.findById(groupId).populate('members');
        if (!group) {
            throw new Error('Group not found');
        }

        // Check if the group type is "Couple" and restrict to 2 members
        if (group.type === 'Couple' && group.members.length >= 2) {
            throw new Error('Couple groups can only have 2 members');
        }

        // Retrieve the registrations of members in the group to check room assignments
        const groupRegistrations = await Registration.find({ groupId: group._id });

        // If the group has occupied any rooms, check if all rooms are full
        const roomOccupancyCheck = await Promise.all(
            groupRegistrations.flatMap((registration) => 
                registration.roomIds.map(async (roomId:string) => {
                    const room = await Room.findById(roomId);
                    if (room) {
                        const currentRoomCount = await Registration.countDocuments({ roomIds: roomId });
                        if (currentRoomCount >= room.nob) {
                            return true; // This room is full
                        }
                    }
                    return false; // Room has space available
                })
            )
        );

        // If all occupied rooms are full, do not allow adding more members
        const allRoomsFull = roomOccupancyCheck.every((isFull) => isFull);
        if (groupRegistrations.length > 0 && allRoomsFull) {
            throw new Error('All rooms occupied by the group are full. Please add more rooms to accommodate additional members.');
        }

        // Remove any existing room assignment for the member, if they have one
        if (existingRegistration && existingRegistration.roomIds && existingRegistration.roomIds.length > 0) {
            await Registration.findByIdAndUpdate(existingRegistration._id, {
                $set: { roomIds: [] }
            });
        }

        // Add the member to the group's members array if not already there
        if (!group.members.includes(memberId)) {
            group.members.push(memberId);
            await group.save();
        }

        // Update the member's registration to assign them to the new group
        await Registration.findOneAndUpdate(
            { memberId, eventId },
            { groupId },
            { new: true, upsert: true } // upsert: true will create the registration if it does not exist
        );

        return JSON.parse(JSON.stringify(group));
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

        // Find the group to ensure it exists
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        // Check if the member exists in the group
        const memberIndex = group.members.indexOf(memberId);
        if (memberIndex === -1) {
            throw new Error('Member is not in the group');
        }

        // Remove the member from the group's members array
        group.members.splice(memberIndex, 1);
        await group.save();

        // Update the member's registration to remove the group assignment
        await Registration.findOneAndUpdate(
            { memberId, eventId },
            { $unset: { groupId: '' } },
            { new: true }
        );

        return JSON.parse(JSON.stringify(group));
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

        return 'Group deleted successfully';
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

