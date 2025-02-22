'use server'
import CAttendance, { ICAttendance } from "../database/models/classattendance.model";
import { connectDB } from "../database/mongoose";
import Member from "../database/models/member.model";
import Ministry from "../database/models/ministry.model";
import { handleResponse } from "../misc";

export async function createCAttendance(ministryId:string, att:Partial<ICAttendance>){
    try {
        await connectDB();
        const {member, sessionId} = att;
        const ministry = await Ministry.findById(ministryId);
        const hasRegistered = ministry?.members?.filter((item:string)=>item === member);
        // let res:ErrorProps;

        // console.log('Regs: ',!hasRegistered.length)

        if(!hasRegistered.length){
           return handleResponse(`Member hasn't been registered for this event`, true, {}, 422);
        }else{
           const hasScanned = await CAttendance.find({sessionId, member:member})
           if(hasScanned.length){
                return handleResponse('This member has already been scanned for the session', true, {}, 422);
           }else{
                await CAttendance.create(att);
                const mem = await Member.findById(member);
                return handleResponse('Member scanned sussessfully', false, mem, 201);
           }
        }
    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse("Error occurred during attendance creation", true, {}, 500);
    }
}


export async function updateCAttendance(id:string, att:Partial<ICAttendance>){
    try {
        const attendance = await CAttendance.findByIdAndUpdate(id, att, {new:true});
        return JSON.parse(JSON.stringify(attendance));
    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse("Error occurred during attendance update", true, {}, 500);
    }
}



export async function getCAttendances(sessionId:string){
    try {
        const attendances = await CAttendance.find({sessionId})
        .populate('member')
        .populate('sessionId')
        .lean();
        return JSON.parse(JSON.stringify(attendances));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching attendance:', error.message);
            throw new Error(`Error occurred during attendance fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during attendance fetch');
        }
    }
}

export async function getCAttendance(id:string){
    try {
        const attendance = await CAttendance.findById(id).populate('member');
        return JSON.parse(JSON.stringify(attendance));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching attendance:', error.message);
            throw new Error(`Error occurred during attendance fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during attendance fetch');
        }
    }
}

export async function deleteCAttendance(id:string){
    try {
        await CAttendance.findByIdAndDelete(id);
        return handleResponse('Attendance deleted successfully', false);
    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse('Error occured deleting attendnace records', true, {}, 500);
    }
}
