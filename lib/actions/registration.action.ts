'use server'
import { revalidatePath } from "next/cache";
import Attendance from "../database/models/attendance.model";
import Group from "../database/models/group.model";
import Registration, { IRegistration } from "../database/models/registration.model";

import { connectDB } from "../database/mongoose";
import { ErrorProps } from "@/types/Types";
import { IMember } from "../database/models/member.model";
// import { isEligible } from "@/functions/misc";
import { IChurch } from "../database/models/church.model";
import { isEligible } from "@/functions/misc";

export async function createRegistration(memberId:string, eventId:string, registration:Partial<IRegistration>){
    try {
        await connectDB();
        const eventReg = await Registration.find({memberId, eventId});
        let res:ErrorProps;
        if(eventReg.length){
            res = {
                message:'Member has already registered for this event',
                error:true,
                code:422
            }
        }else{
            const newReg = await Registration.create(registration);
            res = {
                message:'Member registered successfully',
                error:false,
                payload:newReg,
                code:201
            }
        }
        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating registration:', error.message);
            throw new Error(`Error occurred during registration creation`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during registration creation');
        }
    }
}

export async function checkBadgeIssued(eventId:string){
    try {
        await connectDB();
        const regs = await Registration.find({eventId});
        const badgeIssued = regs.filter((item)=>item.badgeIssued === 'Yes').length;
        return `${badgeIssued}/${regs.length}`
    } catch (error) {
        console.log(error);
    }

}

export async function updateReg (id:string, registration:Partial<IRegistration>){
    try {
        await connectDB();
        const reg = await Registration.findByIdAndUpdate(id, registration, {new:true});
        return JSON.parse(JSON.stringify(reg));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating registration:', error.message);
            throw new Error(`Error occurred during registration update: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during registration update');
        }
    }
}


export async function getRegs(){
    try {
        await connectDB();
        const regs = await Registration.find()
        .populate('groupId')
        .populate({
            path:'memberId',
            populate:{
                path:'church',
                model:'Church',
                populate:{
                    path:'zoneId',
                    model:'Zone'
                }
            }
        })
        .populate('eventId')
        .populate('roomIds')
        .lean();
        return JSON.parse(JSON.stringify(regs));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching registrations:', error.message);
            throw new Error(`Error occurred during registrations fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during registrations fetch');
        }
    }
}

export async function getRegsWithEventId(eventId:string){
    try {
        await connectDB();
        const regs = await Registration.find({eventId})
        .populate('groupId')
        .populate({
            path:'memberId',
            populate:{
                path:'church',
                model:'Church',
                populate:{
                    path:'zoneId',
                    model:'Zone'
                }
            }
        })
        .populate('eventId')
        .populate('roomIds')
        .lean();
        return JSON.parse(JSON.stringify(regs));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching registrations:', error.message);
            throw new Error(`Error occurred during registrations fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during registrations fetch');
        }
    }
}

export async function getRegistrationsWithoutGroups(eventId: string, churchId:string) {
    try {
        await connectDB();

        // Find registrations where groupId is null or undefined for the specified event
        const registrations = await Registration.find({ 
            eventId, 
            groupId: { $exists: false } 
        })
        .populate({
            path:'memberId',
            populate:{
                path:'church',
                model:'Church',
                populate:{
                    path:'zoneId',
                    model:'Zone'
                }
            }
        })
        .lean()
        const eligibles = registrations.filter((reg) => {
            const member = reg.memberId as unknown as IMember;
            // console.log(member)
            // return isEligible(member.ageRange);  // Filter based on eligibility
            const church =  member.church as unknown as IChurch;
            return church._id.toString() === churchId;
        });

        // console.log(eligibles)

        return JSON.parse(JSON.stringify(eligibles));
    } catch (error) {
        console.error('Error fetching registrations without groups:', error);
        throw new Error('Error occurred while fetching registrations without groups');
    }
}
export async function getEligibleRegistrationsWithoutGroups(eventId: string) {
    try {
        await connectDB();

        // Find registrations where groupId is null or undefined for the specified event
        const registrations = await Registration.find({ 
            eventId, 
            groupId: { $exists: false } 
        })
        .populate({
            path:'memberId',
            populate:{
                path:'church',
                model:'Church',
                populate:{
                    path:'zoneId',
                    model:'Zone'
                }
            }
        })
        .lean()
        const eligibles = registrations.filter((reg) => {
            const member = reg.memberId as unknown as IMember;
            // console.log(member)
            return isEligible(member.ageRange);  // Filter based on eligibility
        });

        // console.log(eligibles)

        return JSON.parse(JSON.stringify(eligibles));
    } catch (error) {
        console.error('Error fetching registrations without groups:', error);
        throw new Error('Error occurred while fetching registrations without groups');
    }
}




export async function getReg(id:string){
    try {
        await connectDB();
        const reg = await Registration.findById(id)
        .populate('groupId')
        .populate('memberId')
        .populate('eventId')
        .populate('roomIds')
        .lean();
        return JSON.parse(JSON.stringify(reg));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching registration:', error.message);
            throw new Error(`Error occurred during registration fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during registration fetch');
        }
    }
}


export async function getRegistrationsByGroup(groupId: string) {
    try {
        await connectDB();
        
        // Find all registrations that reference the given groupId
        const registrations = await Registration.find({ groupId }).populate('memberId').populate('eventId').lean();
        
        return JSON.parse(JSON.stringify(registrations));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching registrations for the group:', error.message);
            throw new Error(`Error occurred during registrations fetch for the group: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during registrations fetch for the group');
        }
    }
}


export async function deleteReg(id: string) {
    try {
        await connectDB();
        
        // Find the registration by its ID
        const registration = await Registration.findById(id);
        if (!registration) {
            throw new Error('Registration not found');
        }

        const { memberId, groupId, roomIds, eventId } = registration;

        // Remove the registration
        await Registration.deleteOne({_id:id});

        // Remove the member from any group they belong to for this event
        if (groupId && memberId) {
            await Group.findByIdAndUpdate(
                groupId,
                { $pull: { members: memberId } },  // Remove the member from the members array
                { new: true }
            );
        }

        // Remove the member from all rooms assigned in this event
        if (roomIds && roomIds.length > 0) {
            await Registration.updateMany(
                { roomIds: { $in: roomIds }, eventId },
                { $pull: { roomIds: { $in: roomIds } } }
            );
        }

        // Delete attendance records for the member
        await Attendance.deleteMany({ member: memberId });

        // Optional: Revalidate paths if needed
        revalidatePath('/dashboard/events/badges');
        
        return 'Registration deleted successfully';
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting registration:', error.message);
            throw new Error(`Error occurred during registration deletion: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during registration deletion');
        }
    }
}
