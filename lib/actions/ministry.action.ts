'use server'
import Ministry, { IMinistry } from "../database/models/ministry.model";
import { handleResponse } from "../misc";
import '../database/models/church.model';
import '../database/models/member.model';
import { connectDB } from "../database/mongoose";
import Member, { IMember } from "../database/models/member.model";
// import { IActivity } from "../database/models/activity.model";

export async function createMinistry(ministry:Partial<IMinistry>){
    try {
        await connectDB();
        const act = await Ministry.create(ministry);
        return handleResponse('Ministry created successfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured creating ministry", true, {}, 500);
    }
}

export async function updateMinistry(ministry:Partial<IMinistry>){
    try {
        await connectDB();
        const {_id} = ministry;
        const act = await Ministry.findByIdAndUpdate(_id, ministry, {new:true});
        return handleResponse('Ministry updated sucessfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured updating ministry", true, {}, 500);
    }
}

export async function removeMemberMinistry(id:string, memberId:string){
    try {
        await connectDB();
        const res = await Ministry.findByIdAndUpdate(id, {$pull:{
            members:memberId,
            leaders:memberId,
        }}, {new:true});
        return handleResponse('Member removed sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing member', true);
    }
}

export async function makeLeaderMinistry(id:string, memberId:string[]){
    try {
        await connectDB();
        const res = await Ministry.findByIdAndUpdate(id, {$addToSet:{
            leaders:{$each: memberId},
        }}, {new:true});
        return handleResponse('Leader(s) set sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
    }
}

export async function addMembersToMinistry(id:string, memberId:string[]){
    try {
        await connectDB();
        const res = await Ministry.findByIdAndUpdate(id, {$push:{
            members:{$each: memberId},
        }}, {new:true});
        return handleResponse(`${memberId.length} member(s) added sucessfully`, false, res, 201);
    } catch (error) {
        console.log(error);
    }
}

export async function removeMembersMinistry(id:string, memberIds:string[]){
    try {
        await connectDB();
        const res = await Ministry.findByIdAndUpdate(id, {$pull:{
            members:{$in: memberIds},
            leaders:{$in: memberIds},
        }}, {new:true});
        return handleResponse('Members removed sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing members', true);
    }
}

export async function removeLeaderMinistry(id:string, memberId:string){
    try {
        await connectDB();
        const res = await Ministry.findByIdAndUpdate(id, {$pull:{
            leaders:memberId,
        }}, {new:true});
        return handleResponse('Leader removed sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing leader', true);
    }
}

export async function removeLeadersMinistry(id:string, memberIds:string[]){
    try {
        await connectDB();
        const res = await Ministry.findByIdAndUpdate(id, {$pull:{
            leaders:{$in: memberIds},
        }}, {new:true});
        return handleResponse('Leaders removed sucessfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing leaders', true);
    }
}

export async function getMinistry(id:string){
    try {
        await connectDB();
        const act = await Ministry.findById(id)
        .populate('members')
        .populate('leaders')
        .populate('churchId')
        .lean();
        const data:IMinistry = JSON.parse(JSON.stringify(act))
        return data;
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching ministry", true, {}, 500);
    }
}


export async function getMinistries(){
    try {
        await connectDB();
        const acts = await Ministry.find()
        .populate('members')
        .populate('leaders')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(acts));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching activities", true, {}, 500);
    }
}

export async function getMinistriesForActivity(activityId:string){
    try {
        await connectDB();
        const acts = await Ministry.find({activityId})
        .populate('members')
        .populate('leaders')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(acts)) ;
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching activities", true, {}, 500);
    }
}


export async function getChurchMembersForMigetMinistries(id:string){
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
        return handleResponse("Error occured fetching members for ministry", true, {}, 500);
    }
}

export async function deleteMinistry(id:string){
    try {
        await connectDB();
        await Ministry.deleteOne({_id:id});
        return handleResponse('Class deleted successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured deleting class", true, {}, 500);
    }
}