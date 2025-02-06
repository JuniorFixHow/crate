'use server';
import Activity, { IActivity } from "../database/models/activity.model";
import ClassMinistry, { IClassministry } from "../database/models/classministry.model";
import Ministry from "../database/models/ministry.model";
import Ministryrole from "../database/models/ministryrole.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createClassministry(cm:Partial<IClassministry>){
    try {
        await connectDB();
        const response = await ClassMinistry.create(cm);
        return handleResponse('Ministry created successfully', false, response, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating ministry', true, {}, 500);
    }
}


export async function updateClassministry(cm:Partial<IClassministry>){
    try {
        await connectDB();
        const {_id} = cm;
        const response = await ClassMinistry.findByIdAndUpdate(_id, cm, {new:true});
        return handleResponse('Ministry updated successfully', false, response, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating ministry', true, {}, 500);
    }
}

export async function getClassministry(id:string){
    try {
        await connectDB();
        const response = await ClassMinistry.findById(id);
        return handleResponse('', false, response, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching ministry', true, {}, 500);
    }
}

export async function getClassministries() {
    try {
        await connectDB();
        
        // Fetch all class ministries
        const classMinistries = await ClassMinistry.find().lean() as unknown as IClassministry[];

        // Enrich each class ministry with statistics
        const enrichedClassMinistries = await Promise.all(
            classMinistries.map(async (classMinistry) => {
                const minId = classMinistry._id.toString();

                // Fetch activities for the class ministry
                const activities: IActivity[] = await Activity.find({ minId }).select('_id');
                const activityIds = activities.map((item) => item._id);

                // Fetch ministries and extract member count
                const ministries = await Ministry.find({ activityId: { $in: activityIds } }).select('members');
                const membersNo = ministries.flatMap((ministry) => ministry.members).length;

                // Count ministry roles
                const ministryRolesCount = await Ministryrole.countDocuments({ minId });

                return {
                    ...classMinistry, // Original class ministry fields
                    membersNo,
                    activityNo: activities.length,
                    ministryRolesCount,
                };
            })
        );

        return handleResponse('', false, enrichedClassMinistries, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occurred fetching ministries', true, {}, 500);
    }
}



export async function getChurchClassministries(churchId:string){
    try {
        await connectDB();
         // Fetch all class ministries
         const classMinistries = await ClassMinistry.find({churchId}).lean() as unknown as IClassministry[];

         // Enrich each class ministry with statistics
         const enrichedClassMinistries = await Promise.all(
             classMinistries.map(async (classMinistry) => {
                 const minId = classMinistry._id.toString();
 
                 // Fetch activities for the class ministry
                 const activities: IActivity[] = await Activity.find({ minId }).select('_id');
                 const activityIds = activities.map((item) => item._id);
 
                 // Fetch ministries and extract member count
                 const ministries = await Ministry.find({ activityId: { $in: activityIds } }).select('members');
                 const membersNo = ministries.flatMap((ministry) => ministry.members).length;
 
                 // Count ministry roles
                 const ministryRolesCount = await Ministryrole.countDocuments({ minId });
 
                 return {
                     ...classMinistry, // Original class ministry fields
                     membersNo,
                     activityNo: activities.length,
                     ministryRolesCount,
                 };
             })
         );
 
         return handleResponse('', false, enrichedClassMinistries, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching ministry', true, {}, 500);
    }
}


export async function deleteClassministry(id:string){
    try {
        await connectDB();
        const response = await ClassMinistry.deleteOne({_id:id});
        return handleResponse('Ministry deleted successfully', false, response, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting ministry', true, {}, 500);
    }
}


// misc

export async function getMinistryStats(minId:string){
    try {
        await connectDB();
        const activities:IActivity[] = await Activity.find({minId}).select('_id');
        const activityIds = activities.map((item)=>item._id);
        const ministries = await Ministry.find({activityId: {$in:activityIds}});
        const members = ministries.flatMap(ministry => ministry.members);
        const membersNo = members.length;
        const activityNo = activities.length;
        return {membersNo, activityNo}
    } catch (error) {
        console.log(error)
    }
}