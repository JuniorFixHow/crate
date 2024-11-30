'use server'
import Group from "../database/models/group.model";
import Registration from "../database/models/registration.model";
import Room, { IRoom } from "../database/models/room.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createRoom(room:Partial<IRoom>){
    try {
        await connectDB();
        const newRoom = await Room.create(room);
        return JSON.parse(JSON.stringify(newRoom));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating room:', error.message);
            throw new Error(`Error occurred during room creation: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during room creation');
        }
    }
}

export async function updateRoom(id:string, room:Partial<IRoom>){
    try {
        const rm = await Room.findByIdAndUpdate(id, room, {new:true});
        return JSON.parse(JSON.stringify(rm));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating attendance:', error.message);
            throw new Error(`Error occurred during attendance update: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during attendance update');
        }
    }
}


export async function getRoomsByEvent(eventId:string){
    try {
        const rooms = await Room.find({eventId}).populate('eventId');
        return JSON.parse(JSON.stringify(rooms));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching rooms:', error.message);
            throw new Error(`Error occurred during rooms fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during rooms fetch');
        }
    }
}

export async function getRooms(){
    try {
        const rooms = await Room.find().populate('eventId');
        return JSON.parse(JSON.stringify(rooms));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching rooms:', error.message);
            throw new Error(`Error occurred during rooms fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during rooms fetch');
        }
    }
}

export async function getRoom(id:string){
    try {
        const room = await Room.findById(id).populate('eventId');
        return JSON.parse(JSON.stringify(room));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching room:', error.message);
            throw new Error(`Error occurred during room fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during room fetch');
        }
    }
}


export async function addMemberToRoom(memberId: string, roomId: string) {
    try {
        await connectDB();

        // Check if the member already has a room assigned
        const existingRegistration = await Registration.findOne({ memberId });
        if (!existingRegistration) {
            return handleResponse('Member registration not found', true, {}, 404);
        }

        // Check if the member already has a room assigned
        if (existingRegistration.roomIds && existingRegistration.roomIds.length > 0) {
            return handleResponse('Member already assigned to a room', true, {}, 403);
        }

        // Check if the room is full based on nob
        const room = await Room.findById(roomId);
        if (!room) {
            return handleResponse('Room not found', true, {}, 404);
        }

        const currentRoomCount = await Registration.countDocuments({ roomIds: roomId });
        if (currentRoomCount >= room.nob) {
            return handleResponse('Room is already full', true, {}, 403);
        }

        // Special case handling if the member is part of a "Couple" group
        if (existingRegistration.groupId) {
            const group = await Group.findById(existingRegistration.groupId).populate('members');
            if (group && group.type === 'Couple') {
                // If room has only one bed, check if it can accommodate a couple
                if (room.nob === 1 && currentRoomCount === 1) {
                    const spouseRegistration = await Registration.findOne({ roomIds: roomId, groupId: group._id });
                    if (!spouseRegistration) {
                        return handleResponse('Room with one bed can only accommodate a couple', true, {}, 403);
                    }
                }
            }
        }

        // Assign the room to the member
        await Registration.findByIdAndUpdate(existingRegistration._id, {
            $set: { roomIds: [roomId] }
        });

        return handleResponse('Member successfully assigned to the room', false, {}, 201);
    } catch (error) {
        console.error('Error adding member to room:', error);
        handleResponse('Error occurred while adding member to room',true, {}, 500);
    }
}

export async function addGroupToRoom(roomIds: string[], groupId: string, eventId: string) {
    try {
        await connectDB();

        // Find the group and validate existence
        const group = await Group.findById(groupId).populate('members');
        if (!group) {
            return handleResponse('Group not found', true, {}, 404);
        }

        const totalMembers = group.members.length;
        let totalBedsAvailable = 0;

        // Check if each room has enough available beds
        for (const roomId of roomIds) {
            const room = await Room.findById(roomId);
            if (!room) {
                return handleResponse(`Room with ID ${roomId} not found`, true, {}, 404);
            }

            // Count how many members are already in this room
            const assignedMembers = await Registration.countDocuments({ roomIds: roomId });
            const availableBeds = room.nob - assignedMembers;

            if (availableBeds <= 0) {
                return handleResponse(`Room ${roomId} is already full`, true, {}, 403);
            }

            totalBedsAvailable += availableBeds;
        }

        // Ensure enough beds are available for the group
        if (totalBedsAvailable < totalMembers) {
            return handleResponse(`Not enough available beds to accommodate the entire group. Please add more rooms.`, true, {}, 403);
        }

        // Update registrations to include rooms for the group members
        for (const memberId of group.members) {
            await Registration.findOneAndUpdate(
                { memberId, eventId },
                { $addToSet: { roomIds: { $each: roomIds } } },
                { new: true, upsert: true }
            );
        }

        return handleResponse(`Group successfully assigned to room(s)`, false, {}, 201);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding group to room:', error.message);
            throw new Error(`Error occurred while adding group to room: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while adding group to room');
        }
    }
}


export async function removeMemberFromRoom(memberId: string) {
    try {
        await connectDB();

        // Check if the member has a registration
        const existingRegistration = await Registration.findOne({ memberId });
        if (!existingRegistration || !existingRegistration.roomIds || existingRegistration.roomIds.length === 0) {
            return handleResponse(`Member is not assigned to any room`, true, {}, 422);
        }

        // Remove the room assignment
        await Registration.findByIdAndUpdate(existingRegistration._id, {
            $set: { roomIds: [] }
        });

        return handleResponse(`Member successfully removed from the room`, false, {}, 201);
    } catch (error) {
        console.error('Error removing member from room:', error);
        return handleResponse(`Error occurred while removing member from room`, true, {}, 500);
    }
}


export async function getRoomsForEvent(eventId: string) {
    try {
        await connectDB();

        const rooms = await Room.find({ eventId }).lean();
        return JSON.parse(JSON.stringify(rooms));
    } catch (error) {
        console.error('Error fetching rooms for event:', error);
        throw new Error('Error occurred while fetching rooms');
    }
}

export async function getMembersInRoom(roomId: string) {
    try {
        await connectDB();

        // Fetch all registrations that reference this room
        const registrations = await Registration.find({ roomIds: roomId }).populate('memberId').lean();

        // Extract members from the registrations
        const members = registrations.map(reg => reg.memberId);
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.error('Error fetching members in room:', error);
        throw new Error('Error occurred while fetching members in room');
    }
}


export async function removeGroupFromRoom(roomId: string, groupId: string) {
    try {
        await connectDB();

        // Find the room by its ID
        const room = await Room.findById(roomId);
        if (!room) {
            return handleResponse(`Room not found`, true, {}, 404);
        }

        // Check if the room has the specified groupId
        const group = await Group.findById(groupId);
        if (!group) {
            return handleResponse(`Group not found`, true, {}, 404);
        }

        // Remove the group reference from the room
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $pull: { roomIds: groupId } },
            { new: true }
        );

        if (!updatedRoom) {
            return handleResponse(`Failed to update room`, true, {}, 304);
        }

        // Find all registrations that belong to the group for this room
        const groupMembers = group.members;
        if (groupMembers.length > 0) {
            await Registration.updateMany(
                { memberId: { $in: groupMembers }, roomIds: roomId },
                { $pull: { roomIds: roomId } }
            );
        }

        return handleResponse(`Group removed from room successfully`, false, {}, 201);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error removing group from room:', error.message);
            throw new Error(`Error occurred while removing group from room: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while removing group from room');
        }
    }
}

// export async function removeGroupFromAllRooms(groupId: string) {
//     try {
//         await connectDB();

//         // Find the group by its ID and populate its rooms and members
//         const group = await Group.findById(groupId).populate<{ roomIds: IRoom[]; members: IMember[] }>([
//             { path: 'roomIds' },
//             { path: 'members' }
//         ]);
//         if (!group) {
//             return handleResponse(`Group not found`, true, {}, 404);
//         }

//         const { roomIds, members } = group;

//         if (!roomIds || roomIds.length === 0) {
//             return handleResponse(`No rooms associated with this group`, false, {}, 404);
//         }

//         // Remove the group ID from all associated rooms
//         await Room.updateMany(
//             { _id: { $in: roomIds.map((room:IRoom) => room._id) } },
//             { $pull: { roomIds: groupId } }
//         );

//         // Remove room references from all group members' registrations
//         const memberIds = members.map((member:IMember) => member._id);
//         await Registration.updateMany(
//             { memberId: { $in: memberIds }, roomIds: { $exists: true, $ne: [] } },
//             { $pull: { roomIds: { $in: roomIds.map((room:IRoom) => room._id) } } }
//         );

//         return handleResponse(`Group removed from all associated rooms successfully`, false, {}, 201);
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error('Error removing group from all rooms:', error.message);
//             throw new Error(`Error occurred while removing group from all rooms: ${error.message}`);
//         } else {
//             console.error('Unknown error:', error);
//             throw new Error('Error occurred while removing group from all rooms');
//         }
//     }
// }


export async function removeGroupFromAllRooms(groupId: string) {
    try {
        await connectDB();

        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return handleResponse(`Group not found`, true, {}, 404);
        }

        // Clear roomIds from the group
        await Group.findByIdAndUpdate(groupId, { $set: { roomIds: [] } });

        // Update registrations for members in the group to remove roomIds
        await Registration.updateMany(
            { groupId: groupId },
            { $set: { roomIds: [] } }
        );

        return handleResponse(`Group removed from all rooms successfully`, false, {}, 201);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error removing group from all rooms:', error.message);
            throw new Error(`Error occurred while removing group from all rooms: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while removing group from all rooms');
        }
    }
}





export async function deleteRoom(id: string) {
    try {
        await connectDB();

        // Check if the room exists
        const room = await Room.findById(id);
        if (!room) {
            throw new Error('Room not found');
        }

        // Remove the room from all registrations
        await Registration.updateMany(
            { roomIds: id },
            { $pull: { roomIds: id } }
        );

        // Remove the room from all groups
        await Group.updateMany(
            { roomIds: id },
            { $pull: { roomIds: id } }
        );

        // Delete the room after updates are done
        await Room.findByIdAndDelete(id);

        return 'Room deleted successfully';
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting room:', error.message);
            throw new Error(`Error occurred during room deletion: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during room deletion');
        }
    }
}



export async function isRoomFull(roomId: string): Promise<boolean> {
    try {
        await connectDB();

        // Find the room by ID
        const room = await Room.findById(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        // Count the number of registrations referencing this room
        const memberCount = await Registration.countDocuments({ roomIds: roomId });

        // Compare the member count with the room's nob (number of beds)
        return memberCount >= room.nob;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error checking room capacity:', error.message);
            throw new Error(`Error occurred while checking room capacity: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred while checking room capacity');
        }
    }
}



export async function getAvailableRooms(eventId: string) {
    try {
        await connectDB(); // Ensure the DB connection is made

        // Find all rooms for the given eventId
        const rooms = await Room.find({ eventId });

        if (!rooms || rooms.length === 0) {
            return handleResponse('No rooms found for this event', true, {}, 404);
        }

        // Filter rooms that are not full (i.e., current count of registrations < room capacity)
        const availableRooms: IRoom[] = [];

        for (const room of rooms) {
            const currentRoomCount = await Registration.countDocuments({ roomIds: room._id });

            if (currentRoomCount < room.nob) {
                availableRooms.push(room);
            }
        }

        // Return available rooms if any found
        if (availableRooms.length > 0) {
            return handleResponse('Available rooms found', false, availableRooms, 200);
        } else {
            return handleResponse('No available rooms found for this event', true, {}, 404);
        }

    } catch (error) {
        console.error('Error fetching available rooms:', error);
        return handleResponse('Error occurred while fetching available rooms', true, {}, 500);
    }
}

