'use server'

import { cookies } from "next/headers";
import Group from "../database/models/group.model";
import { connectDB } from "../database/mongoose";
import { decrypt, SessionPayload } from "../session";
import Zone from "../database/models/zone.model";
import Church from "../database/models/church.model";
import Member from "../database/models/member.model";
import Registration from "../database/models/registration.model";
import Vendor from "../database/models/vendor.model";
import Event from "../database/models/event.model";
import Session from "../database/models/session.model";

export async function getGroupLenght(eventId?: string) {
    try {
        await connectDB(); // Ensure this is awaited
        const length = await Group.countDocuments(eventId ? { eventId } : {});
        return { length };
    } catch (error) {
        console.error('Error fetching group length:', error);
        throw new Error('Error occurred fetching data'); // Explicitly throw to propagate the error
    }
}



export async function getNextGroupNumber() {
    try {
        await connectDB();

        const groups = await Group.countDocuments({});
        
        // If no group exists, default to 1
        let nextGroupNumber;
        if(groups > 0){
            const lastGroup = await Group.findOne().sort({ groupNumber: -1 }); // Get the latest group by groupNumber
            nextGroupNumber = lastGroup?.groupNumber ? lastGroup.groupNumber + 1 : 1;
        }
        else{
            nextGroupNumber = 1;
        }
        
        // console.log('Groups', nextGroupNumber)
        return {nextGroupNumber};
    } catch (error) {
        console.error('Error fetching next group number:', error);
        throw new Error('Error occurred while fetching next group number');
    }
}


export async function getSession(): Promise<SessionPayload | null>{
    const session = (await cookies()).get('session')?.value;
    if(!session) return null;
    const decrypted = await decrypt(session) as SessionPayload
    return decrypted
}


export async function getEverything(){
    try {
        await connectDB();
        const [z, c, m, r, v, e] = await Promise.all([
            Zone.find().lean(),
            Church.find().populate('zoneId').lean(),
            Member.find().populate({
                path: 'church',         
                populate: {
                    path: 'zoneId',    
                    model: 'Zone'     
                }
            })
            .populate('registeredBy').lean(),
            Registration.find()
            .populate({
                path:'memberId',
                populate:{
                    path:'church',
                    model:'Church'
                }
            })
            .populate('eventId')
            .lean(),
            Vendor.find()
            .populate('church')
            .lean(),
            Event.find().lean()
        ])
        const zones = JSON.parse(JSON.stringify(z));
        const churches = JSON.parse(JSON.stringify(c));
        const members = JSON.parse(JSON.stringify(m));
        const registrations = JSON.parse(JSON.stringify(r));
        const vendors = JSON.parse(JSON.stringify(v));
        const events = JSON.parse(JSON.stringify(e));

        return {zones, churches, members, registrations, vendors, events}
    } catch (error) {
        console.log(error)
    }
}


export async function getVendorStats(vendorId:string){
    try {
        await connectDB();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
        // Fetch counts for the past 7 days
        const [memberCount, eventCount, sessionCount] = await Promise.all([
          Member.countDocuments({
            registeredBy: vendorId,
            createdAt: { $gte: sevenDaysAgo },
          }),
          Event.countDocuments({
            createdBy: vendorId,
            createdAt: { $gte: sevenDaysAgo },
          }),
          Session.countDocuments({
            createdBy: vendorId,
            createdAt: { $gte: sevenDaysAgo },
          }),
        ]);

        const members = JSON.parse(JSON.stringify(memberCount));
        const events = JSON.parse(JSON.stringify(eventCount));
        const sessions = JSON.parse(JSON.stringify(sessionCount));

        return {members, events, sessions}
    } catch (error) {
        console.log('Error occured fetching vendor stats');
        console.log(error)
    }
}