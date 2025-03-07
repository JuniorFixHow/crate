'use server'
import Attendance from "../database/models/attendance.model";
import Church from "../database/models/church.model";
import Group from "../database/models/group.model";
import Member from "../database/models/member.model";
import Registration from "../database/models/registration.model";
import Vendor from "../database/models/vendor.model";
import Zone, { IZone } from "../database/models/zone.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createZone(zone:Partial<IZone>){
    try {
        await connectDB();
        const {name} = zone;
        if(name === 'CRATE Main'){
            return handleResponse(`The name "CRATE Main" is reserved. Try different name.`, true, {}, 403);
        }
        const newZone = await Zone.create(zone);
        return handleResponse('Zone created successfully', false, newZone, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating zone', true, {}, 500);
    }
}

export async function updateZone (id:string, zone:Partial<IZone>){
    try {
        await connectDB();
        const {name} = zone;
        const zz = await Zone.findById(id);
        if(zz.name === 'CRATE Main'){
            return handleResponse('You cannot alter this zone', true, {}, 403);
        }
        if(name === 'CRATE Main'){
            return handleResponse(`The name "CRATE Main" is reserved. Try different name.`, true, {}, 403);
        }
        const z = await Zone.findByIdAndUpdate(id, zone, {new:true});
        return handleResponse('Zone updated successfully', false, z, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting zone', true, {}, 500);
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

        const z = await Zone.findById(id);
        if(z.name === 'CRATE Main'){
            return handleResponse('You cannot delete this zone', true, {}, 403);
        }

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

        return handleResponse('Zone deleted successfully', false);
    } catch (error) {
        console.error('Error deleting zone:', error);
        return handleResponse('Error occurred during zone deletion', true);
    }
}

