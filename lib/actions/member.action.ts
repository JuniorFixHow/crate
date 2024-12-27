'use server'
import Vendor from "../database/models/vendor.model";
import Member, { IMember } from "../database/models/member.model";
import { connectDB } from "../database/mongoose";
import Zone from "../database/models/zone.model";
import Church from "../database/models/church.model";
import Attendance from "../database/models/attendance.model";
import Registration from "../database/models/registration.model";
import Group from "../database/models/group.model";
import { handleResponse } from "../misc";
// import { isEligible } from "@/functions/misc";
import Response from "../database/models/response.model";

export async function createMember(member: Partial<IMember>) {
    try {
        await connectDB();

        const {email} = member;
        if(email){
            const mem = await Member.findOne({email})
            if(mem){
                return handleResponse('Email is associated with another member', true, {}, 422);
            }
        }
        // Create the new member
        const newMember = await Member.create(member);

        // Find the church associated with the new member
        const church = await Church.findById(newMember.church);
        if (!church) {
            throw new Error('Church not found');
        }

        // Count the youth members in the church (age range 18-50)
        const youthCount = await Member.countDocuments({
            church: church._id,
            ageRange: { $in: ['11-20', '21-30', '31-40', '41-50', '51-60'] }
        });

       
        // Find the zone associated with the church
        const zone = await Zone.findById(church.zoneId);
        if (!zone) {
            throw new Error('Zone not found');
        }

        if(newMember.registeredBy){
            await Vendor.findByIdAndUpdate(newMember.registeredBy, {$inc:{registrants:1}})
        }
        // Atomically increment the 'registrants' field in the zone and the church
        await Zone.findByIdAndUpdate(zone._id, {
            $inc: { registrants: 1 }, // Increment the 'registrants' field in zone
        }, { new: true });

        await Church.findByIdAndUpdate(church._id, {
            $inc: { registrants: 1 }, // Increment the 'registrants' field in church
            $set: { youth: youthCount } // Update the youth count in church
        }, { new: true });

        return handleResponse('Member created successfully',false, newMember, 201);

    } catch (error) {
        console.log(error);
        throw new Error('Error occurred during member creation');
    }
}


export async function updateMember(id: string, member: Partial<IMember>) {
    try {
        await connectDB();

        const { email } = member;

        if (email) {
            // Fetch the member being updated
            const existingMember = await Member.findById(id);

            if (!existingMember) {
                return handleResponse('Member not found', true, {}, 404);
            }

            // Check if the email is being changed
            if (existingMember.email !== email) {
                // Check if the new email already exists for another member
                const emailExists = await Member.findOne({ email });

                if (emailExists) {
                    return handleResponse('Another member exists with this email', true, {}, 422);
                }
            }
        }

        // Find and update the member
        const updatedMember = await Member.findByIdAndUpdate(id, member, { new: true, runValidators:true });

        if (!updatedMember) {
            throw new Error('Member not found');
        }

        // Find the church associated with the updated member
        const church = await Church.findById(updatedMember.church);
        if (!church) {
            throw new Error('Church not found');
        }

        // Count the youth members in the church (age range 18-50)
        const youthCount = await Member.countDocuments({
            church: church._id,
            ageRange: { $in: ['11-20', '21-30', '31-40', '41-50', '51-60'] },
        });

        // Count all registrants in the specific church
        const registrants = await Member.countDocuments({
            church: church._id,
        });

        // Update the church's registrants and youth counts
        await Church.findByIdAndUpdate(
            church._id,
            {
                registrants,
                youth: youthCount,
            },
            { new: true }
        );

        // Find the zone associated with the church
        const zone = await Zone.findById(church.zoneId);
        if (!zone) {
            throw new Error('Zone not found');
        }

        // Count the total registrants for all churches in the zone
        const zoneChurchIds = await Church.find({ zoneId: zone._id }).distinct('_id');
        const totalZoneRegistrants = await Member.countDocuments({
            church: { $in: zoneChurchIds },
        });

        // Update the zone's registrants count
        await Zone.findByIdAndUpdate(
            zone._id,
            {
                registrants: totalZoneRegistrants,
            },
            { new: true }
        );

        return handleResponse('Member updated successfully', false, updatedMember, 201); // Return the updated member
    } catch (error) {
        console.error('Error occurred updating member:', error);
        throw new Error('Error occurred updating member');
    }
}






export async function getMembers() {
    try {
        await connectDB();

        // Populate the 'church' field, then the 'zoneId' field inside 'church', and also the 'registeredBy' field (vendor)
        const members = await Member.find()
            .populate({
                path: 'church',         // Populate the 'church' reference
                populate: {
                    path: 'zoneId',     // Populate the 'zoneId' reference in the 'church' model
                    model: 'Zone'       // Specify the model for the 'zoneId' reference
                }
            })
            .populate('campuseId')
            .populate('registeredBy').lean(); // Populate the 'registeredBy' field (vendor reference)

        // Return the populated members data
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching members');
    }
}

export async function getMembersInaCampuse(campuseId:string) {
    try {
        await connectDB();

        // Populate the 'church' field, then the 'zoneId' field inside 'church', and also the 'registeredBy' field (vendor)
        const members = await Member.find({campuseId})
            .populate({
                path: 'church',         // Populate the 'church' reference
                populate: {
                    path: 'zoneId',     // Populate the 'zoneId' reference in the 'church' model
                    model: 'Zone'       // Specify the model for the 'zoneId' reference
                }
            })
            .populate('campuseId')
            .populate('registeredBy').lean(); // Populate the 'registeredBy' field (vendor reference)

        // Return the populated members data
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching members');
    }
}


export async function getUserMembers(id:string) {
    try {
        await connectDB();

        // Populate the 'church' field, then the 'zoneId' field inside 'church', and also the 'registeredBy' field (vendor)
        const members = await Member.find({registeredBy:id})
            .populate({
                path: 'church',         // Populate the 'church' reference
                populate: {
                    path: 'zoneId',     // Populate the 'zoneId' reference in the 'church' model
                    model: 'Zone'       // Specify the model for the 'zoneId' reference
                }
            })
            .populate('campuseId')
            .populate('registeredBy').lean(); // Populate the 'registeredBy' field (vendor reference)

        // Return the populated members data
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching members');
    }
}


export async function getVendorMemberRegistrations(registeredBy:string){
    try {
        await connectDB();
        const members = await Member.countDocuments({registeredBy});
        return members;
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching members data');
    }
}


export async function getMember(id:string){
    try {
        await connectDB();
        const zone = await Member.findById(id).populate({
            path: 'church',         // Populate the 'church' reference
            populate: {
                path: 'zoneId',     // Populate the 'zoneId' reference in the 'church' model
                model: 'Zone'       // Specify the model for the 'zoneId' reference
            }
        })
        .populate('campuseId')
        .populate('registeredBy').lean(); 
        return JSON.parse(JSON.stringify(zone));
    } catch (error) {
        console.log(error);
        throw new Error('Error occured!');
    }
}

export async function getUnassignedMembers(eventId: string, churchId:string) {
    try {
        await connectDB();

        // Get all members currently assigned to groups for the specific event
        const groups = await Group.find({ eventId }).select('members').lean();

        // Flatten the members arrays from all groups into a single array
        const assignedMemberIds = groups.flatMap(group => group.members);

        // Fetch eligible members who are not in the assignedMemberIds array
        const unassignedMembers = await Member.find({
            _id: { $nin: assignedMemberIds }, // Members not assigned to any group,
            church:churchId
        })
        .populate({
            path: 'church',         // Populate the 'church' reference
            populate: {
                path: 'zoneId',     // Populate the 'zoneId' reference in the 'church' model
                model: 'Zone'       // Specify the model for the 'zoneId' reference
            }
        })
        .populate('campuseId')
        .lean();

        // Filter the unassigned members to return only the eligible ones
        // const eligibleUnassignedMembers = unassignedMembers.filter((member) =>  {
        //     console.log(isEligible(member.ageRange));
        //     return isEligible(member.ageRange)
        // });

        return JSON.parse(JSON.stringify(unassignedMembers));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching unassigned members:', error.message);
            throw new Error(`Error occurred during unassigned members fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during unassigned members fetch');
        }
    }
}




export async function deleteMember(id: string) {
    try {
        await connectDB();

        // Find the member by their ID
        const member = await Member.findById(id);
        if (!member) {
            throw new Error('Member not found');
        }

        // Find the church associated with the member
        const church = await Church.findById(member.church);
        if (!church) {
            throw new Error('Church not found');
        }

        // Decrement the registrants count for the vendor who registered the member, if applicable
        if (member.registeredBy) {
            await Vendor.findByIdAndUpdate(member.registeredBy, { $inc: { registrants: -1 } });
        }

        // Check if the member is registered for an event (group/room) and handle related data
        const registrations = await Registration.find({ memberId: member._id });
        for (const registration of registrations) {
            // If the member is part of a group, remove them from the group's members array
            if (registration.groupId) {
                await Group.findByIdAndUpdate(registration.groupId, {
                    $pull: { members: member._id }
                });
            }

            // If the member is assigned to rooms, remove their room assignments
            if (registration.roomIds?.length) {
                await Registration.updateMany(
                    { memberId: member._id },
                    { $set: { roomIds: [] } }
                );
            }

            // Delete the registration entry for the member
            await Registration.findByIdAndDelete(registration._id);
        }

        await Promise.all([
            Attendance.deleteMany({ member: member._id }),
            Response.deleteMany({ memberId: member._id }),
        ])
        // Remove the member's attendance records, if any
       

        // Delete the member itself
        await Member.findByIdAndDelete(member._id);

        // Recalculate the youth count for the church
        const youthCount = await Member.countDocuments({
            church: church._id,
            ageRange: { $in: ['18-35', '36-50'] }
        });

        // Recalculate the registrants count for the specific church
        const registrants = await Member.countDocuments({ church: church._id });

        // Update the church's youth and registrants counts
        await Church.findByIdAndUpdate(church._id, {
            youth: youthCount,
            registrants
        }, { new: true });

        // Find the zone associated with the church
        const zone = await Zone.findById(church.zoneId);
        if (!zone) {
            throw new Error('Zone not found');
        }

        // Recalculate the total registrants for all churches in the zone
        const zoneChurchIds = await Church.find({ zoneId: zone._id }).distinct('_id');
        const totalZoneRegistrants = await Member.countDocuments({
            church: { $in: zoneChurchIds }
        });

        // Update the zone's registrants count
        await Zone.findByIdAndUpdate(zone._id, {
            registrants: totalZoneRegistrants
        }, { new: true });

        return 'Member deleted successfully';
    } catch (error) {
        console.error('Error occurred during member deletion:', error);
        throw new Error('Error occurred during member deletion');
    }
}


