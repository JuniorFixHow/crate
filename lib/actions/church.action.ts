'use server'
import Member from "../database/models/member.model";
import Vendor from "../database/models/vendor.model";
import Church, { IChurch } from "../database/models/church.model";
import { connectDB } from "../database/mongoose";
import Zone from "../database/models/zone.model";
import Attendance from "../database/models/attendance.model";
import Registration from "../database/models/registration.model";
import Group from "../database/models/group.model";

export async function createChurch(church: Partial<IChurch>) {
    try {
        await connectDB();

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

        return JSON.parse(JSON.stringify(newChurch));
        
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred during church creation');
    }
}


export async function updateChurch(id: string, church: Partial<IChurch>) {
    try {
        await connectDB();

        // Update the church document
        const updatedChurch = await Church.findByIdAndUpdate(id, church, { new: true });

        // Count the number of churches in the same zone as the updated church
        const churchesCount = await Church.countDocuments({ zoneId: updatedChurch.zoneId });

        // Update the zone with the new church count
        await Zone.findByIdAndUpdate(updatedChurch.zoneId, { churches: churchesCount }, { new: true });

        // Return the updated church
        return JSON.parse(JSON.stringify(updatedChurch));

    } catch (error) {
        console.log(error);
        throw new Error('Error occurred during church update');
    }
}


export async function getChurches() {
    try {
        await connectDB();

        // Populate the 'zoneId' field in the 'Church' model with the related Zone
        const churches = await Church.find().populate('zoneId'); // 'zoneId' should be the reference to the Zone model
        
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
        const zone = await Church.findById(id).populate('zoneId');
        return JSON.parse(JSON.stringify(zone));
    } catch (error) {
        console.log(error);
        throw new Error('Error occured!');
    }
}

export async function deleteChurch(id: string) {
    try {
        await connectDB();

        // Find the church by its ID
        const church = await Church.findById(id);
        if (!church) {
            throw new Error('Church not found');
        }

        // Find members related to this church
        const members = await Member.find({ church: church._id });
        const memberIds = members.map((member) => member._id);

        if (memberIds.length > 0) {
            // Delete registrations associated with these members
            await Registration.deleteMany({ memberId: { $in: memberIds } });

            // Remove members from groups
            await Group.updateMany(
                { members: { $in: memberIds } },
                { $pull: { members: { $in: memberIds } } }
            );

            // Remove members from rooms
            await Registration.updateMany(
                { memberId: { $in: memberIds } },
                { $set: { roomIds: [] } }
            );

            // Delete attendance records for these members
            await Attendance.deleteMany({ member: { $in: memberIds } });
        }

        // Delete members and vendors related to this church
        await Member.deleteMany({ church: church._id });
        await Vendor.deleteMany({ church: church._id });

        // Decrement the 'churches' count in the zone
        await Zone.findByIdAndUpdate(church.zoneId, { $inc: { churches: -1 } }, { new: true });

        // Delete the church itself
        await Church.findByIdAndDelete(church._id);

        return 'Church deleted successfully';
    } catch (error) {
        console.error('Error deleting church:', error);
        throw new Error('Error occurred during church deletion');
    }
}
