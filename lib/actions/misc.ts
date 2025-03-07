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
import Payment from "../database/models/payment.model";
import { handleResponse } from "../misc";
import { SignatureProps } from "@/types/Types";
import path from "path";
import os from 'os';
import fs from 'fs';

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
        const developersChurch = await Church.findOne({ name: "CRATE Main" }).select("_id");
        const [z, c, m, r, v, e] = await Promise.all([
            Zone.find().lean(),
            Church.find({name: {$ne:'CRATE Main'}}).populate('zoneId').lean(),
            Member.find({church:{$ne:developersChurch?._id}}).populate({
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
            .populate('groupId')
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
        const developersChurch = await Church.findOne({ name: "CRATE Main" }).select("_id");
    
        // Fetch counts for the past 7 days
        const [memberCount, eventCount, sessionCount, revenue] = await Promise.all([
          Member.countDocuments({
            registeredBy: vendorId,
            createdAt: { $gte: sevenDaysAgo },
            church: {$ne:developersChurch?._id}
          }),
          Event.countDocuments({
            createdBy: vendorId,
            createdAt: { $gte: sevenDaysAgo },
          }),
          Session.countDocuments({
            createdBy: vendorId,
            createdAt: { $gte: sevenDaysAgo },
          }),
          Payment.find({
            payee:vendorId,
            createdAt: { $gte: sevenDaysAgo}
        })
        ]);

        const totalAmount = revenue.reduce((sum, payment) => sum + payment.amount, 0);

        const members = JSON.parse(JSON.stringify(memberCount));
        const events = JSON.parse(JSON.stringify(eventCount));
        const sessions = JSON.parse(JSON.stringify(sessionCount));

        return {members, events, sessions, totalAmount}
    } catch (error) {
        console.log('Error occured fetching vendor stats');
        console.log(error)
    }
}

export async function saveSignatureToFile(data:SignatureProps){
    try {
        const {name, sign} = data;
        
        const documenstPath = path.join(os.homedir(), 'Documents', 'CRATE');
        if(!fs.existsSync(documenstPath)){
            fs.mkdirSync(documenstPath, {recursive:true});
        }

        const filename = name ? `${name} signature.png` : `${Date.now()}.png`;
        const filePath = path.join(documenstPath, filename);

        const base64Data = sign.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(filePath, base64Data, 'base64');

        return handleResponse(`File saved successfully to ${filePath}`, false, {filePath}, 201);
        
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured saving saignature', true, {}, 500);
    }
}




