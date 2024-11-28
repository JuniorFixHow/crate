'use server'
import Attendance from "../database/models/attendance.model";
import Church from "../database/models/church.model";
import Group from "../database/models/group.model";
import Member from "../database/models/member.model";
import Registration from "../database/models/registration.model";
import Vendor from "../database/models/vendor.model";
import Zone, { IZone } from "../database/models/zone.model";
import { connectDB } from "../database/mongoose";

export async function createZone(zone:Partial<IZone>){
    try {
        await connectDB();
        const newZone = await Zone.create(zone);
        return JSON.parse(JSON.stringify(newZone));
        
    } catch (error) {
        console.log(error);
        throw new Error('Error occured!');
    }
}

export async function updateZone (id:string, zone:Partial<IZone>){
    try {
        await connectDB();
        const z = await Zone.findByIdAndUpdate(id, zone, {new:true});
        return JSON.parse(JSON.stringify(z));
    } catch (error) {
        console.log(error);
        throw new Error('Error occured!');
    }
}

export async function getZones(){
    try {
        await connectDB();
        const zones = await Zone.find();
        return JSON.parse(JSON.stringify(zones));
    } catch (error) {
        console.log(error);
        throw new Error('Error occured!');
    }
}

export async function getZone(id:string){
    try {
        await connectDB();
        const zone = await Zone.findById(id);
        return JSON.parse(JSON.stringify(zone));
    } catch (error) {
        console.log(error);
        throw new Error('Error occured!');
    }
}

export async function deleteZone(id: string) {
    try {
        await connectDB();

        // Find all churches within the zone
        const churches = await Church.find({ zoneId: id });

        // Process churches and their related data
        const deleteChurchesAndRelatedData = churches.map(async (church) => {
            // Find members for each church
            const members = await Member.find({ church: church._id });

            const memberIds = members.map((member) => member._id);

            // Delete registrations associated with these members
            if (memberIds.length > 0) {
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

            // Delete members and vendors for the church
            await Member.deleteMany({ church: church._id });
            await Vendor.deleteMany({ church: church._id });
        });

        // Wait for all deletion operations to complete
        await Promise.all(deleteChurchesAndRelatedData);

        // Delete the churches within the zone
        await Church.deleteMany({ zoneId: id });

        // Finally, delete the zone itself
        await Zone.findByIdAndDelete(id);

        return 'Zone deleted successfully';
    } catch (error) {
        console.error('Error deleting zone:', error);
        throw new Error('Error occurred during zone deletion');
    }
}

