'use server'
import { handleResponse } from "../misc";
import '../database/models/church.model';
import '../database/models/member.model';
import { connectDB } from "../database/mongoose";
import Ministryrole, { IMinistryrole } from "../database/models/ministryrole.model";
// import { IActivity } from "../database/models/activity.model";

export async function createMinistryrole(ministryrole:Partial<IMinistryrole>){
    try {
        await connectDB();
        const act = await Ministryrole.create(ministryrole);
        return handleResponse('Leadership role created successfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured creating ministry role", true, {}, 500);
    }
}

export async function updateMinistryrole(ministryrole:Partial<IMinistryrole>){
    try {
        await connectDB();
        const {_id} = ministryrole;
        const act = await Ministryrole.findByIdAndUpdate(_id, ministryrole, {new:true});
        return handleResponse('Leadership role updated sucessfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured updating ministry role", true, {}, 500);
    }
}





export async function getMinistryrole(id:string){
    try {
        await connectDB();
        const act = await Ministryrole.findById(id)
        .populate('memberId')
        .populate('churchId')
        .lean();
        const data:IMinistryrole = JSON.parse(JSON.stringify(act))
        return data;
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching ministry role", true, {}, 500);
    }
}


export async function getMinistryroles(){
    try {
        await connectDB();
        const acts = await Ministryrole.find()
        .populate('memberId')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(acts));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching ministry roles", true, {}, 500);
    }
}

export async function getMinistryrolesforMinistry(minId:string){
    try {
        await connectDB();
        const acts = await Ministryrole.find({minId})
        .populate('memberId')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(acts));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching ministry roles", true, {}, 500);
    }
}



export async function deleteMinistryrole(id:string){
    try {
        await connectDB();
        await Ministryrole.deleteOne({_id:id});
        return handleResponse('Leadership role deleted successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured deleting ministry role", true, {}, 500);
    }
}