'use server'
import Member from "../database/models/member.model";
import Vendor from "../database/models/vendor.model";
import Church, { IChurch } from "../database/models/church.model";
import { connectDB } from "../database/mongoose";
import Zone from "../database/models/zone.model";
import Attendance from "../database/models/attendance.model";
import Registration from "../database/models/registration.model";
import Group from "../database/models/group.model";
import { handleResponse } from "../misc";
import './contract.action';
import Campuse from "../database/models/campuse.model";
import mongoose from "mongoose";

export async function createChurch(church: Partial<IChurch>) {
    try {
        await connectDB();

        const {name} = church;
        if(name === 'CRATE Main'){
            return handleResponse(`The name "CRATE Main" is reserved`, true, {}, 403);
        }
        // Create the new church
        const newChurch = await Church.create(church);

        // Find the zone associated with the new church
        const zone = await Zone.findById(newChurch.zoneId);

        // Check if the zone exists
        if (!zone) {
            throw new Error('Zone not found');
        }

        // Atomically increment the 'churches' field in the zone
        await Zone.findByIdAndUpdate(zone._id, {
            $inc: { churches: 1 } // Increment the 'churches' field by 1
        }, { new: true });

        return handleResponse('New church created successfully', false, newChurch, 201)
        
    } catch (error) {
        console.log(error);
        return handleResponse('Error occurred during church creation', true, {}, 500)
    }
}


export async function updateChurch(id: string, church: Partial<IChurch>) {
    try {
        await connectDB();

        const c = await Church.findById(id);
        if(c.name === 'CRATE Main'){
            return handleResponse(`You cannot alter this church`, true, {}, 403);
        }

        const {name} = church;
        if(name === 'CRATE Main'){
            return handleResponse(`The name "CRATE Main" is reserved`, true, {}, 403);
        }
        // Update the church document
        const updatedChurch = await Church.findByIdAndUpdate(id, church, { new: true });

        // Count the number of churches in the same zone as the updated church
        const churchesCount = await Church.countDocuments({ zoneId: updatedChurch.zoneId });

        // Update the zone with the new church count
        await Zone.findByIdAndUpdate(updatedChurch.zoneId, { churches: churchesCount }, { new: true });

        // Return the updated church
        return handleResponse('Church updated successfully', false, updatedChurch, 201);

    } catch (error) {
        console.log(error);
        throw new Error('Error occurred during church update');
    }
}


export async function getChurches() {
    try {
        await connectDB();

        // Populate the 'zoneId' field in the 'Church' model with the related Zone
        const churches = await Church.find()
        .populate('zoneId')
        .populate('campuses')
        .populate('contractId')
        .lean();
        
        // Return the populated churches
        return JSON.parse(JSON.stringify(churches));
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching churches');
    }
}

export async function getChurchesInaZone(zoneId:string) {
    try {
        await connectDB();

        // Populate the 'zoneId' field in the 'Church' model with the related Zone
        const churches = await Church.find({zoneId}).populate('zoneId'); // 'zoneId' should be the reference to the Zone model
        
        // Return the populated churches
        return JSON.parse(JSON.stringify(churches));
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching churches');
    }
}


export async function getChurch(id:string){
    try {
        await connectDB();
        const zone = await Church.findById(id)
        .populate('zoneId')
        .populate('campuses')
        .populate('contractId')
        .lean();
        return JSON.parse(JSON.stringify(zone));
    } catch (error) {
        console.log(error);
        throw new Error('Error occured!');
    }
}


export async function deleteChurch(id: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await connectDB();

        const church = await Church.findById(id).session(session);
        if (!church) {
            return handleResponse('Church not found!', true, {}, 404);
        }
        if (church.name === 'CRATE Main') {
            return handleResponse('You cannot delete this church', true, {}, 403);
        }

        // Get all related member IDs
        const memberIds = await Member.find({ church: church._id }, '_id').session(session);
        const memberIdList = memberIds.map(m => m._id);

        if (memberIdList.length > 0) {
            await Promise.all([
                Registration.deleteMany({ memberId: { $in: memberIdList } }).session(session),
                Group.updateMany(
                    { members: { $in: memberIdList } },
                    { $pull: { members: { $in: memberIdList } } }
                ).session(session),
                Attendance.deleteMany({ member: { $in: memberIdList } }).session(session)
            ]);
        }

        // Delete members, groups, vendors, campuses
        await Promise.all([
            Member.deleteMany({ church: church._id }).session(session),
            Group.deleteMany({ churchId: church._id }).session(session),
            Vendor.deleteMany({ church: church._id }).session(session),
            Campuse.deleteMany({ churchId: church._id }).session(session),
            Zone.findByIdAndUpdate(church.zoneId, { $inc: { churches: -1 } }, { new: true }).session(session),
            Church.findByIdAndDelete(church._id).session(session)
        ]);

        await session.commitTransaction();
        session.endSession();

        return handleResponse('Church deleted successfully', false, {}, 201);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deleting church:', error);
        return handleResponse('Error occurred during church deletion', true, {}, 500);
    }
}



export async function unlicenseChurch(id:string){
    try {
        await connectDB();
        const church = await Church.findByIdAndUpdate(id, {
            $unset:{contractId:""}
        }, {new:true});
        return handleResponse('Church unlicensed successfully', false, church, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured unlicensing church', true);
    }
}