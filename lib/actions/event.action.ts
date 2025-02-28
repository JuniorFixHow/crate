'use server'
import { revalidatePath } from "next/cache";
import Attendance from "../database/models/attendance.model";
import Event, { IEvent } from "../database/models/event.model";
import Group from "../database/models/group.model";
import Registration, { IRegistration } from "../database/models/registration.model";
import Room from "../database/models/room.model";
import Session from "../database/models/session.model";
import { connectDB } from "../database/mongoose";
import Member from "../database/models/member.model";
import { handleResponse } from "../misc";
import '../database/models/vendor.model';

export async function createEvent(event:Partial<IEvent>){
    try {
        await connectDB();
        const newEvent = await Event.create(event);
        return JSON.parse(JSON.stringify(newEvent));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating event:', error.message);
            throw new Error(`Error occurred during event creation: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during event creation');
        }
    }
}

export async function updateEvent (id:string, event:Partial<IEvent>){
    try {
        await connectDB();
        const evt = await Event.findByIdAndUpdate(id, event, {new:true});
        return JSON.parse(JSON.stringify(evt));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating event:', error.message);
            throw new Error(`Error occurred during event update: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during event update');
        }
    }
}

export async function getEvents(){
    try {
        await connectDB();
        const events = await Event.find().populate('createdBy').lean();
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching events:', error.message);
            throw new Error(`Error occurred during events fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during events fetch');
        }
    }
}

export async function getChurchEvents(churchId:string){
    try {
        await connectDB();
        const events = await Event.find({churchId}).populate('createdBy').lean();
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching events:', error.message);
            throw new Error(`Error occurred during events fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during events fetch');
        }
    }
}


export async function getVendorEventRegistrations(createdBy:string){
    try {
        await connectDB();
        const events = await Event.countDocuments({createdBy});
        return events;
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching members data');
    }
}


export async function getUserEvents(userId:string){
    try {
        await connectDB();
        const events = await Event.find({createdBy:userId}).populate('createdBy').lean();
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching events:', error.message);
            throw new Error(`Error occurred during events fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during events fetch');
        }
    }
}


export async function getUnregisteredMembers(memberIds: string[], eventId: string) {
    try {
        await connectDB();

        // Find all registrations for the given event and extract registered member IDs
        const registrations = await Registration.find({ eventId, memberId: { $in: memberIds } }).select('memberId').lean();
        const registeredMemberIds = registrations.map((reg) => reg.memberId.toString());

        // Find members in the provided memberIds array who are not in registeredMemberIds
        const unregisteredMembers = await Member.find({
            _id: { $in: memberIds.filter((id) => !registeredMemberIds.includes(id)) }
        }).lean();

        return handleResponse('Unregistered members fetched successfully', false, unregisteredMembers, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occurred fetching unregistered members', true, {}, 500);
    }
}


export async function updateBadgeIssuedForMembers(memberIds: string[], eventId: string) {
    try {
        await connectDB();

        // Perform the update for all the matching registrations
        const result = await Registration.updateMany(
            {
                memberId: { $in: memberIds }, // Find registrations for the given member IDs
                eventId,                     // Match the event ID
                badgeIssued: "No",           // Only update if the badge is currently "No"
            },
            {
                $set: { badgeIssued: "Yes" }, // Update the badgeIssued field to "Yes"
            }
        );

        return handleResponse(
            `Successfully updated badgeIssued for ${result.modifiedCount} members.`,
            false,
            { modifiedCount: result.modifiedCount },
            200
        );
    } catch (error) {
        console.log(error);
        return handleResponse('Error occurred while updating badgeIssued for members', true, {}, 500);
    }
}


export async function getEvent(id:string){
    try {
        await connectDB();
        const event = await Event.findById(id).populate('createdBy').lean();
        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching event:', error.message);
            throw new Error(`Error occurred during event fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during event fetch');
        }
    }
}

export async function getCYPEvents(){
    try {
        await connectDB();
        const events = await Event.find({type:'Conference'});
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.log(error);
    }
}


export async function deleteEvent(id:string){
    try {
        await connectDB();
        const event = await Event.findById(id);
        const sessions = await Session.find({eventId:event._id});
        if(sessions.length){
            const deleteSessionsAndAttendance = sessions.map(async(session)=>{
                const att = await Attendance.find({sessionId:session._id});
                if(att.length){
                    await Attendance.deleteMany({sessionId:session._id});
                }
            })
            await Promise.all(deleteSessionsAndAttendance);
            await Session.deleteMany({eventId:event._id});
        }
        const groups = await Group.find({eventId:event._id});
        if(groups.length){
            await Group.deleteMany({eventId:event._id});
        }

        const rooms = await Room.find({eventId:event._id});
        if(rooms.length){
            // const deleteRoomKeys = rooms.map((item)=>{})
            await Room.deleteMany({eventId:event._id});
        }

        const regs = await Registration.find({eventId:event._id});
        if(regs.length){
            await Registration.deleteMany({eventId:event._id});
        }

        await Event.findByIdAndDelete(event._id);
        revalidatePath('/dashboard/events');
        return 'Event deleted succssfully';
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting event:', error.message);
            throw new Error(`Error occurred during event deletion: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during event deletion');
        }
    }
}

export async function checkMemberRegistration(memberId:string, eventId:string){
    try {
        await connectDB();
        const hasRegistered = await Registration.find({memberId, eventId})
        .populate('groupId')
        .populate('memberId')
        .populate('eventId') 
        .populate({
            path:'roomIds',
            populate:{
                path:'venueId',
                model:'Venue'
            }
        })
        .lean();
        const truth = hasRegistered.length > 0
        if(hasRegistered.length){
            const data:IRegistration = JSON.parse(JSON.stringify(hasRegistered[0]));
            return {truth, data};
            
        }else{
            return {truth}
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error checking member status:', error.message);
            throw new Error(`Error occurred checking member status: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred checking member status');
        }
    }
}