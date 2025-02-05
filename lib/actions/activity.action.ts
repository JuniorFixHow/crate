'use server'
import Activity, { IActivity } from "../database/models/activity.model";
import { handleResponse } from "../misc";
import '../database/models/church.model';
import '../database/models/member.model';
import { connectDB } from "../database/mongoose";
import Member, { IMember } from "../database/models/member.model";
import Ministry from "../database/models/ministry.model";
import '../database/models/classministry.model';

export async function createActivity(activity:Partial<IActivity>){
    try {
        await connectDB();
        const act = await Activity.create(activity);
        return handleResponse('Activity created successfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured creating activity", true, {}, 500);
    }
}

export async function updateActivity(activity:Partial<IActivity>){
    try {
        await connectDB();
        const {_id} = activity;
        const act = await Activity.findByIdAndUpdate(_id, activity, {new:true});
        return handleResponse('Activity updated sucessfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured updating activity", true, {}, 500);
    }
}

export async function removeMember(id:string, memberId:string){
    try {
        await connectDB();
        const res = await Activity.findByIdAndUpdate(id, {$pull:{
            members:memberId,
            leaders:memberId,
        }}, {new:true});
        return handleResponse('Member removed sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing member', true);
    }
}

export async function makeLeader(id:string, memberId:string[]){
    try {
        await connectDB();
        const res = await Activity.findByIdAndUpdate(id, {$addToSet:{
            leaders:{$each: memberId},
        }}, {new:true});
        return handleResponse('Leader(s) set sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
    }
}

export async function addMembersToActivity(id:string, memberId:string[]){
    try {
        await connectDB();
        const res = await Activity.findByIdAndUpdate(id, {$push:{
            members:{$each: memberId},
        }}, {new:true});
        return handleResponse(`${memberId.length} member(s) added sucessfully`, false, res, 201);
    } catch (error) {
        console.log(error);
    }
}

export async function removeMembers(id:string, memberIds:string[]){
    try {
        await connectDB();
        const res = await Activity.findByIdAndUpdate(id, {$pull:{
            members:{$in: memberIds},
            leaders:{$in: memberIds},
        }}, {new:true});
        return handleResponse('Members removed sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing members', true);
    }
}

export async function removeLeader(id:string, memberId:string){
    try {
        await connectDB();
        const res = await Activity.findByIdAndUpdate(id, {$pull:{
            leaders:memberId,
        }}, {new:true});
        return handleResponse('Leader removed sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing leader', true);
    }
}

export async function removeLeaders(id:string, memberIds:string[]){
    try {
        await connectDB();
        const res = await Activity.findByIdAndUpdate(id, {$pull:{
            leaders:{$in: memberIds},
        }}, {new:true});
        return handleResponse('Leaders removed sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing leaders', true);
    }
}

export async function getActivity(id:string){
    try {
        await connectDB();
        const act = await Activity.findById(id)
        .populate('members')
        .populate('leaders')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(act));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching activity", true, {}, 500);
    }
}


export async function getActivities(){
    try {
        await connectDB();
        const acts = await Activity.find()
        .populate('members')
        .populate('leaders')
        .populate('churchId')
        .populate('minId')
        .lean();
        return JSON.parse(JSON.stringify(acts));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching activities", true, {}, 500);
    }
}

export async function getActivitiesForChurch(churchId:string){
    try {
        await connectDB();
        const acts = await Activity.find({churchId})
        .populate('members')
        .populate('leaders')
        .populate('churchId')
        .populate('minId')
        .lean();
        return JSON.parse(JSON.stringify(acts));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching activities", true, {}, 500);
    }
}

export async function getActivitiesForChurchMinistry(minId:string){
    try {
        await connectDB();
        const acts = await Activity.find({minId})
        .populate('members')
        .populate('leaders')
        .populate('churchId')
        .populate('minId')
        .lean();
        return JSON.parse(JSON.stringify(acts));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching activities", true, {}, 500);
    }
}


export async function getChurchMembersForMinistry(id:string){
    try {
        await connectDB();
        const act = await Ministry.findById(id)
        const churchId:string = act.churchId;
        const actMembers:string[] = act.members;
        const members = await Member.find({church:churchId});
        const notMembers = members.filter((item:IMember)=> !actMembers.includes(item._id))
        return JSON.parse(JSON.stringify(notMembers));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching members for class", true, {}, 500);
    }
}


export async function getChurchMembersForActivities(id:string){
    try {
        await connectDB();
        const act = await Activity.findById(id)
        const churchId:string = act.churchId;
        const actMembers:string[] = act.members;
        const members = await Member.find({church:churchId});
        const notMembers = members.filter((item:IMember)=> !actMembers.includes(item._id))
        return JSON.parse(JSON.stringify(notMembers));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching members for activity", true, {}, 500);
    }
}

export async function deleteActivity(id:string){
    try {
        await connectDB();
        await Activity.deleteOne({_id:id});
        return handleResponse('Activity deleted successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured deleting activity", true, {}, 500);
    }
}