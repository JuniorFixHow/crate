'use server'
import { Types } from "mongoose";
import Group from "../database/models/group.model";
import Member, { IMember } from "../database/models/member.model";
import Registration, { IRegistration } from "../database/models/registration.model";
import Room, { IRoom } from "../database/models/room.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";
import Key from "../database/models/key.model";
import { isEligible } from "@/functions/misc";
import '../database/models/venue.model';

export async function createRoom(room:Partial<IRoom>){
    try {
        await connectDB();
        const newRoom = await Room.create(room);
        return handleResponse('Room created successfully', false, newRoom, 201)
    } catch (error) {
        // if (error instanceof Error) {
        //     console.error('Error creating room:', error.message);
        //     throw new Error(`Error occurred during room creation: ${error.message}`);
        // } else {
        //     console.error('Unknown error:', error);
        //     throw new Error('Error occurred during room creation');
        // }
        console.log(error);
        return handleResponse('Error occured creating room', true, {}, 500)
    }
}

export async function createRooms(rooms:Partial<IRoom>[]){
    try {
        await connectDB();
        const newRoom = await Room.insertMany(rooms, {ordered:false});
        return handleResponse(`${rooms?.length} rooms created successfully`, false, newRoom, 201);
    } catch (error) {
        // if (error instanceof Error) {
        //     console.error('Error creating room:', error.message);
        //     throw new Error(`Error occurred during room creation: ${error.message}`);
        // } else {
        //     console.error('Unknown error:', error);
        //     throw new Error('Error occurred during room creation');
        // }
        console.log(error);
        return handleResponse('Error occured creating rooms', true, {}, 500)
    }
}

export async function updateRoom(id:string, room:Partial<IRoom>){
    try {
        const rm = await Room.findByIdAndUpdate(id, room, {new:true, runValidators:true});
        return handleResponse('Room updated successfully', false, rm, 201);
    } catch (error) {
        // if (error instanceof Error) {
        //     console.error('Error updating room:', error.message);
        //     throw new Error(`Error occurred during room update: ${error.message}`);
        // } else {
        //     console.error('Unknown error:', error);
        //     throw new Error('Error occurred during room update');
        // }
        console.log(error);
        return handleResponse('Error occured updating room', true, {}, 500)
    }
}


export async function getRoomsByEvent(eventId:string){
    try {
        const rooms = await Room.find({eventId})
        .populate('eventId')
        .populate('venueId')
        .lean();
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
        const rooms = await Room.find()
        .populate('eventId')
        .populate('venueId')
        .populate('facId')
        .lean();
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
export async function getRoomsForChurch(churchId:string){
    try {
        const rooms = await Room.find({churchId})
        .populate('eventId')
        .populate('venueId')
        .populate('facId')
        .lean();
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

export async function getRoomsInaVenue(venueId:string){
    try {
        const rooms = await Room.find({venueId})
        .populate('eventId')
        .populate('venueId')
        .populate('facId')
        .lean();
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
        const room = await Room.findById(id)
        .populate('eventId')
        .populate('venueId')
        .populate('facId')
        .lean();
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

        if (existingRegistration.roomIds && existingRegistration.roomIds.length > 0) {
            return handleResponse('Member already assigned to a room', true, {}, 403);
        }

        // Fetch member details to check eligibility
        const member = await Member.findById(memberId);
        if (!member) {
            return handleResponse('Member not found', true, {}, 404);
        }

        const eligible = isEligible(member.ageRange); // Determine eligibility

        // Check if the room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return handleResponse('Room not found', true, {}, 404);
        }

        // Fetch current occupancy of the room
        const currentRoomCount = await Registration.countDocuments({ roomIds: roomId });

        // Check room occupancy if the member is eligible
        if (eligible && currentRoomCount >= room.nob) {
            return handleResponse('Room is already full for eligible members', true, {}, 403);
        }

        // Handle special case for "Couple" groups
        if (existingRegistration.groupId) {
            const group = await Group.findById(existingRegistration.groupId).populate('members');
            if (group && group.type === 'Couple') {
                // If member is eligible, enforce couple group capacity
                if (eligible) {
                    if (group.members.length >= 2) {
                        return handleResponse('Couple groups can only have 2 eligible members', true, {}, 403);
                    }
                }
                // Allow non-eligible members to bypass the capacity check
            }
        }

        // Assign the room to the member
        await Registration.findByIdAndUpdate(existingRegistration._id, {
            $set: { roomIds: [roomId] }
        });

        return handleResponse('Member successfully assigned to the room', false, {}, 201);
    } catch (error) {
        console.error('Error adding member to room:', error);
        return handleResponse('Error occurred while adding member to room', true, {}, 500);
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

        // Check if the group already has assigned rooms
        const existingRoomIds = group.roomIds || [];
        if (existingRoomIds.length === 0) {
            // Perform the bed availability check only for the first allocation
            if (group.type !== 'Couple') {
                let totalBedsAvailable = 0;

                for (const roomId of roomIds) {
                    const room = await Room.findById(roomId);
                    if (!room) {
                        return handleResponse(`Room not found`, true, {}, 404);
                    }

                    // Count eligible members in the room
                    const assignedEligibleMembers = await Registration.aggregate([
                        { $match: { roomIds: roomId } }, // Find registrations in the room
                        {
                            $lookup: {
                                from: 'members', // Assuming a "members" collection
                                localField: 'memberId',
                                foreignField: '_id',
                                as: 'memberDetails',
                            },
                        },
                        { $unwind: '$memberDetails' }, // Flatten the memberDetails array
                        {
                            $match: {
                                'memberDetails.ageRange': { $in: ['6-10','11-20', '21-30', '31-40', '41-50', '51-60', '61+'] },
                            },
                        },
                        { $count: 'eligibleCount' }, // Count eligible members
                    ]);

                    const eligibleCount = assignedEligibleMembers[0]?.eligibleCount || 0;

                    // Calculate available beds based on eligible members
                    const availableBeds = room.nob - eligibleCount;

                    if (availableBeds <= 0) {
                        return handleResponse(
                            `Room ${room.venue} ${room.number} is already full`,
                            true,
                            {},
                            403
                        );
                    }

                    totalBedsAvailable += availableBeds;
                }

                // Ensure enough beds are available for non-couple groups
                if (totalBedsAvailable < group.eligible) {
                    return handleResponse(
                        `Not enough available beds to accommodate the entire eligible group. Please add more rooms.`,
                        true,
                        {},
                        403
                    );
                }
            }
        }

        // Update registrations to include rooms for the group members
        for (const memberId of group.members) {
            const member = await Member.findById(memberId);
            const eligible = isEligible(member?.ageRange);

            // Assign room IDs only for eligible members
            if (eligible) {
                await Registration.findOneAndUpdate(
                    { memberId, eventId },
                    { $addToSet: { roomIds: { $each: roomIds } } },
                    { new: true, upsert: true }
                );
            }
        }

        // Update the group with the assigned roomIds
        await Group.findByIdAndUpdate(
            groupId,
            { $addToSet: { roomIds: { $each: roomIds } } }, // Ensure unique roomIds in the array
            { new: true }
        );

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

        const rooms = await Room.find({ eventId })
        .populate('venueId')
        .populate('eventId')
        .populate('facId')
        .lean();
        return JSON.parse(JSON.stringify(rooms));
    } catch (error) {
        console.error('Error fetching rooms for event:', error);
        throw new Error('Error occurred while fetching rooms');
    }
}

export async function getRoomsForFacility(facId: string) {
    try {
        await connectDB();

        const rooms = await Room.find({ facId })
        .populate('venueId')
        .populate('eventId')
        .populate('facId')
        .lean();
        return JSON.parse(JSON.stringify(rooms));
    } catch (error) {
        console.error('Error fetching rooms for event:', error);
        throw new Error('Error occurred while fetching rooms');
    }
}

export async function getRoomsForVenue(venueId: string) {
    try {
        await connectDB();

        const rooms = await Room.find({ venueId })
        .populate('venueId')
        .populate('eventId')
        .populate('facId')
        .lean();
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
        // const members = registrations.map(reg => reg.memberId);
        return JSON.parse(JSON.stringify(registrations));
    } catch (error) {
        console.error('Error fetching members in room:', error);
        throw new Error('Error occurred while fetching members in room');
    }
}





export async function removeGroupFromRoom(roomId: string, groupId: string) {
    try {
        await connectDB();

        // Find the group to ensure it exists
        const group = await Group.findById(groupId);
        if (!group) {
            return handleResponse(`Group not found`, true, {}, 404);
        }

        // Ensure the group references the room
        if (!group.roomIds?.includes(roomId)) {
            return handleResponse(`Room is not assigned to the group`, true, {}, 400);
        }

        // Calculate the remaining rooms and their total capacity
        const remainingRoomIds = group.roomIds.filter((id: string) => id.toString() !== roomId);

        // If the group has other rooms, check the total capacity
        if (remainingRoomIds.length > 0) {
            const rooms = await Room.find({ _id: { $in: remainingRoomIds } });
            const totalCapacity = rooms.reduce((sum, room) => sum + room.nob, 0);

            if (totalCapacity < group.eligible) {
                return handleResponse(
                    `Cannot remove the room. Remaining rooms cannot accommodate the group members. You can rather unallocate the group completely.`,
                    true,
                    {},
                    403
                );
            }
        }

        // Remove the room from the group's `roomIds`
        group.roomIds = remainingRoomIds;
        await group.save();

        // Find the group members' registrations who are eligible
        const eligibleAgeRanges = ['6-10','11-20', '21-30', '31-40', '41-50', '51-60', '61+']; // List of eligible age ranges
        const eligibleMembers = await Member.find({
            _id: { $in: group.members },
            ageRange: { $in: eligibleAgeRanges },
        });

        const eligibleMemberIds = eligibleMembers.map((member: IMember) => member._id.toString());

        // Update the registrations to remove the room reference for eligible group members
        if (eligibleMemberIds.length > 0) {
            await Registration.updateMany(
                { memberId: { $in: eligibleMemberIds }, roomIds: roomId },
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

        await Key.deleteMany({roomId:id});

        // Delete the room after updates are done
        await Room.deleteOne({_id:id});

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
        const rooms = await Room.find({ eventId })
            .populate('venueId')
            .populate('facId')
            .lean() as unknown as IRoom[];
        

        if (!rooms || rooms.length === 0) {
            return handleResponse('No rooms found for this event', true, {}, 404);
        }

        // Create a map to track room registrations
        const roomRegistrationCount: Record<string, number> = {};

        // Retrieve all registrations for the given event
        const registrations = await Registration.find({ eventId });

        for (const registration of registrations) {
            const roomIds = Array.isArray(registration.roomIds)
                ? registration.roomIds.map((roomId: string | IRoom | Types.ObjectId) => {
                      if (typeof roomId === 'string') {
                          return roomId;
                      } else if ('_id' in roomId) {
                          return roomId._id.toString();
                      } else {
                          throw new Error('Unexpected type for roomId');
                      }
                  })
                : [];

            for (const roomId of roomIds) {
                roomRegistrationCount[roomId] = (roomRegistrationCount[roomId] || 0) + 1;
            }
        }

        // Filter rooms based on their available capacity
        const availableRooms = rooms.filter((room) => {
            const registrationsForRoom = roomRegistrationCount[room._id.toString()] || 0;
            return room.nob && registrationsForRoom < room.nob;
        });

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






export const getRoomsAssignedToGroup = async (groupId: string) => {
    try {
        await connectDB();

        // Find the group by its ID
        const group = await Group.findById(groupId);
        if (!group) {
            return handleResponse('Group not found', true, [], 404);
        }

        // Check if the group has room assignments
        if (!group.roomIds || group.roomIds.length === 0) {
            return handleResponse('No rooms assigned to this group', false, {}, 200);
        }

        // Fetch all rooms associated with the group
        const rooms = await Room.find({ _id: { $in: group.roomIds } });
        return handleResponse('Rooms retrieved successfully', false, rooms, 200);
    } catch (error) {
        console.error('Error retrieving rooms for group:', error);
        return handleResponse(`Error retrieving rooms for group`, true, {}, 500);
    }
};




export async function getMergedRegistrationData() {
    try {
        await connectDB();

        // Step 1: Fetch all registrations and populate memberId and roomIds
        const registrations = await Registration.find({})
            .populate({
                path: 'memberId',
                populate: {
                    path: 'church',
                    model: 'Church',
                    populate: {
                        path: 'zoneId',
                        model: 'Zone',
                    },
                },
            })
            .populate('eventId')
            .populate('groupId')
            .populate({
                path:'roomIds',
                populate:{
                    path:'venueId',
                    model:'Venue'
                }
            }) 
            .lean<IRegistration[]>(); // Explicitly cast the result to IRegistration[]

        // Step 2: Fetch all keys associated with the registration holders
        const registrationIds = registrations.map((reg) => reg._id);
        const keys = await Key.find({ holder: { $in: registrationIds } }).lean();

        // Step 3: Merge the keys into their respective registrations
        const result = registrations.map((registration) => {
            // Cast registration to IRegistration to access `_id` properly
            const regId = registration._id.toString();

            // Attach keys related to this registration
            const associatedKeys = keys.filter(
                (key) => key.holder.toString() === regId
            );

            return {
                ...registration,
                keys: associatedKeys,
            };
        });

        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.error('Error fetching registration details:', error);
        throw new Error('Error occurred while fetching registration details');
    }
}

// export async function getRegistrationDetails() {
//     try {
//         await connectDB();

//         // Step 1: Fetch all registrations and populate memberId and roomIds
//         const registrations = await Registration.find({})
//             .populate({
//                 path: 'memberId',
//                 populate: {
//                     path: 'church',
//                     model: 'Church',
//                     populate: {
//                         path: 'zoneId',
//                         model: 'Zone',
//                     },
//                 },
//             })
//             .populate('roomIds') // Populate the rooms directly
//             .lean<IRegistration[]>(); // Explicitly cast the result to IRegistration[]

//         // Step 2: Fetch all keys associated with the registration holders
//         const registrationIds = registrations.map((reg) => reg._id);
//         const keys = await Key.find({ holder: { $in: registrationIds } }).lean();

//         // Step 3: Merge the keys into their respective registrations
//         const result = registrations.map((registration) => {
//             // Cast registration to IRegistration to access `_id` properly
//             const regId = registration._id.toString();

//             // Attach keys related to this registration
//             const associatedKeys = keys.filter(
//                 (key) => key.holder.toString() === regId
//             );

//             return {
//                 ...registration,
//                 keys: associatedKeys,
//             };
//         });

//         return JSON.parse(JSON.stringify(result));
//     } catch (error) {
//         console.error('Error fetching registration details:', error);
//         throw new Error('Error occurred while fetching registration details');
//     }
// }






  