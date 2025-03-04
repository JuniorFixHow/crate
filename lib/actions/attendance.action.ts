'use server'
import { ErrorProps } from "@/types/Types";
import Attendance, { IAttendance } from "../database/models/attendance.model";
import Registration from "../database/models/registration.model";
import { connectDB } from "../database/mongoose";
import Member from "../database/models/member.model";
import { handleResponse } from "../misc";

export async function createAttendance(eventId:string, att:Partial<IAttendance>){
    try {
        await connectDB();
        const {member, sessionId} = att;
        const hasRegistered = await Registration.find({eventId, memberId:member});
        let res:ErrorProps;

        // console.log('Regs: ',!hasRegistered.length)

        if(!hasRegistered.length){
            res={
                message:`Member hasn't been registered for this event`,
                error:true,
            }
        }else{
           const hasScanned = await Attendance.find({sessionId, member:member})
           if(hasScanned.length){
                res = {
                    message:'This member has already been scanned for the session',
                    error:true
                }
           }else{
                await Attendance.create(att);
                const mem = await Member.findById(member);
                res = {
                    message:'Member scanned sussessfully', error:false,
                    payload:mem
                }
           }
        }
        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating attendance:', error.message);
            throw new Error(`Error occurred during attendance creation: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during attendance creation');
        }
    }
}


export async function updateAttendance(id:string, att:Partial<IAttendance>){
    try {
        const attendance = await Attendance.findByIdAndUpdate(id, att, {new:true});
        return JSON.parse(JSON.stringify(attendance));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating attendance:', error.message);
            throw new Error(`Error occurred during attendance creation: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during attendance creation');
        }
    }
}



export async function getAttendances(sessionId:string){
    try {
        const attendances = await Attendance.find({sessionId})
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

export async function getAttendance(id:string){
    try {
        const attendance = await Attendance.findById(id).populate('member');
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

export async function deleteAttendance(id:string){
    try {
        await Attendance.findByIdAndDelete(id);
        return handleResponse('Attendance deleted successfully', false);
    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse('Error occurred during attendance deletion', true, {}, 500);
    }
}
