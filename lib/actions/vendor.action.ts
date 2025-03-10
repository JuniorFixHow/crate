'use server'
import Vendor, { IVendor } from "../database/models/vendor.model";
import { connectDB } from "../database/mongoose";
import Zone from "../database/models/zone.model";
import Church from "../database/models/church.model";
import Member from "../database/models/member.model";
import Session from "../database/models/session.model";
import Event from "../database/models/event.model";
import { revalidatePath } from "next/cache";
import { handleResponse } from "../misc";

export async function createVendor(vendor: Partial<IVendor>) {
    try {
        await connectDB();

        // Create the new vendor
        const {email} = vendor;
        const v = await Vendor.findOne({email});
        if(v){
            return handleResponse('Another vendor exists with this email address', true, {}, 422);
        }else{

            const newVendor = await Vendor.create(vendor);
    
            // Find the church associated with the new vendor
            const church = await Church.findById(newVendor.church);
            if (!church) {
                throw new Error('Church not found');
            }
    
            // Count coordinators and volunteers concurrently for the specific church
            const [coordCount, volCount, adminCount] = await Promise.all([
                Vendor.countDocuments({ church: church._id, role: { $eq: 'Coordinator' } }),
                Vendor.countDocuments({ church: church._id, role: { $eq: 'Volunteer' } }),
                Vendor.countDocuments({ church: church._id, role: { $eq: 'Admin' } })
            ]);
            // Update the church information
            await Church.findByIdAndUpdate(church._id, {
                $set: { coordinators: coordCount, volunteers: volCount, admins:adminCount }
            }, { new: true });
    
            // Find the zone associated with the church
            const zone = await Zone.findById(church.zoneId);
            if (!zone) {
                throw new Error('Zone not found');
            }
    
            // Increment the correct field in the zone
            const incrementField = vendor.role === 'Admin' ? 'admins' : vendor.role === 'Coordinator' ? 'coordinators' : 'volunteers';
            await Zone.findByIdAndUpdate(zone._id, {
                $inc: { [incrementField]: 1 }
            }, { new: true });
    
            revalidatePath('/dashboard/vendors')
            return handleResponse('User created successfully. They should check their email to verify their account', false, newVendor, 201);
        }


    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse('Error occurred during user creation', true, {}, 500)
    }
}




export async function updateVendor(id: string, vendor: Partial<IVendor>) {
    try {
        await connectDB();

        const {email} = vendor;
        const vend = await Vendor.find({email})
        if(vend.length >= 1 && vend[0].email !== email){
            return handleResponse('This email is already used.', true, {}, 422);
        }else{
            // Find and update the vendor
            const v = await Vendor.findByIdAndUpdate(id, vendor, { new: true });
            if (!v) {
                throw new Error('User not found');
            }
    
            // Find the church associated with the updated member
            const church = await Church.findById(v.church);
            if (!church) {
                throw new Error('Church not found');
            }

            // Count coordinators and volunteers for the specific church
            const [coordCount, volCount, adminCount] = await Promise.all([
                Vendor.countDocuments({ church: church._id, role: { $eq: 'Coordinator' } }),
                Vendor.countDocuments({ church: church._id, role: { $eq: 'Volunteer' } }),
                Vendor.countDocuments({ church: church._id, role: { $eq: 'Admin' } }),
            ]);
    
            // Update the church information with the latest counts
            await Church.findByIdAndUpdate(church._id, {
                $set: { coordinators: coordCount, volunteers: volCount, admin:adminCount }
            }, { new: true });
    
            // Find the zone associated with the church
            const zone = await Zone.findById(church.zoneId);
            if (!zone) {
                throw new Error('Zone not found');
            }
            // Count the coordinators and volunteers for all churches in the zone
            const [zoneCoordCount, zoneVolCount, zoneAdminCount] = await Promise.all([
                Vendor.countDocuments({ church: { $in: await Church.find({ zoneId: zone._id }).distinct('_id') }, role: { $eq: 'Coordinator' } }),
                Vendor.countDocuments({ church: { $in: await Church.find({ zoneId: zone._id }).distinct('_id') }, role: { $eq: 'Volunteer' } }),
                Vendor.countDocuments({ church: { $in: await Church.find({ zoneId: zone._id }).distinct('_id') }, role: { $eq: 'Admin' } })
            ]);
    
            // Update the zone information with the total counts
            await Zone.findByIdAndUpdate(zone._id, {
                $set: { coordinators: zoneCoordCount, volunteers: zoneVolCount, admins:zoneAdminCount }
            }, { new: true });
    
            revalidatePath('/dashboard/vendors')
    
            return handleResponse('User updated successfully', false, v, 201);
        }



    } catch (error) {
        console.error('Error occurred updating user:', error);
        return handleResponse('Error occurred updating user', true, {}, 500)
    }
}





export async function getVendors() {
    try {
        await connectDB();

        // Populate the 'church' field, then the 'zoneId' field inside 'church', and also the 'registeredBy' field (vendor)
        const vendors = await Vendor.find()
            .populate({
                path: 'church',         // Populate the 'church' reference
                populate: {
                    path: 'zoneId',     // Populate the 'zoneId' reference in the 'church' model
                    model: 'Zone'       // Specify the model for the 'zoneId' reference
                }
            }).lean()
             // Populate the 'registeredBy' field (vendor reference)

        // Return the populated vendors data
        return JSON.parse(JSON.stringify(vendors));
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching users');
    }
}

export async function getVendorsInAChurch(church:string) {
    try {
        await connectDB();

        // Populate the 'church' field, then the 'zoneId' field inside 'church', and also the 'registeredBy' field (vendor)
        const vendors = await Vendor.find({church})
            .populate({
                path: 'church',         // Populate the 'church' reference
                populate: {
                    path: 'zoneId',     // Populate the 'zoneId' reference in the 'church' model
                    model: 'Zone'       // Specify the model for the 'zoneId' reference
                }
            }).lean()
             // Populate the 'registeredBy' field (vendor reference)

        // Return the populated vendors data
        return JSON.parse(JSON.stringify(vendors));
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching users');
    }
}

export async function updateVendorRoles(userIds:string[], roles:string[]){
    try {
        await connectDB();
        await Promise.all(
            userIds.map((id)=>(
                Vendor.findByIdAndUpdate(id, {
                    roles
                }, {new:true})
            ))
        )
        const message = 'Roles removed successfully';
        const message2 = `${roles.length > 1 ? 'Roles':'Role'} assigned successfully`;
        return handleResponse(roles.length === 0 ? message : message2, false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured assigning roles', true, {}, 500);
    }
}



export async function getVendor(id:string){
    try {
        await connectDB();
        const vendor = await Vendor.findById(id).populate({
            path: 'church',         // Populate the 'church' reference
            populate: {
                path: 'zoneId',     // Populate the 'zoneId' reference in the 'church' model
                model: 'Zone'       // Specify the model for the 'zoneId' reference
            }
        }).lean()
        return JSON.parse(JSON.stringify(vendor));
    } catch (error) {
        console.log(error);
        throw new Error('Error occured fetching user!');
    }
}

export async function deleteVendor(id: string) {
    try {
        await connectDB();

        // Find the vendor by its ID
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            throw new Error('User not found');
        }

        // Find the church associated with the vendor
        const church = await Church.findById(vendor.church);
        if (!church) {
            throw new Error('Church not found');
        }


        // Determine the role type for decrementing counts
        const incrementField = vendor.role === 'Admin' ? 'admins' : vendor.role === 'Coordinator' ? 'coordinators' : 'volunteers';

        // Update the zone counts by decrementing
        const zone = await Zone.findById(church.zoneId);
        if (zone) {
            await Zone.findByIdAndUpdate(zone._id, {
                $inc: { [incrementField]: -1 }
            }, { new: true });
        }

        // Update the church counts by decrementing
        await Church.findByIdAndUpdate(church._id, {
            $inc: { [incrementField]: -1 }
        }, { new: true });

        const members = await Member.find({registeredBy:vendor._id});
        const events = await Event.find({createdBy:vendor._id});
        const sessions = await Session.find({createdBy:vendor._id});
        if(members.length){
            await Member.updateMany({registeredBy:vendor._id},{
                $unset:{registeredBy:""}
            })
        }

        if(events.length){
            await Event.updateMany({createdBy:vendor._id},{
                $unset:{createdBy:""}
            })
        }
        if(sessions.length){
            await Session.updateMany({createdBy:vendor._id},{
                $unset:{createdBy:""}
            })
        }
        // Delete the vendor itself
        await Vendor.findByIdAndDelete(vendor._id);

        // Return success message
        revalidatePath('/dashboard/users')
        return handleResponse('User deleted successfully', false);

    } catch (error) {
        console.error('Error occurred during user deletion:', error);
        // throw new Error('Error occurred during user deletion');
        return handleResponse('Error occurred during user deletion', true);
    }
}


