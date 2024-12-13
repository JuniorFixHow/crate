'use server'

import CYPSet, { ICYPSet } from "../database/models/cypset.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createCpySet(cyp:Partial<ICYPSet>){
    try {
        await connectDB();
        const res = await CYPSet.create(cyp);
        return handleResponse('Collection created successfully', false, res, 201)
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating the set', true, {}, 500)
    }
}

export async function updateCYPSet(id:string, cyp:Partial<ICYPSet>){
    try {
        await connectDB();
        const res = await CYPSet.findByIdAndUpdate(id, cyp, {new:true});
        return handleResponse('Set updated successfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating the set', true, {}, 500)
    }
}

export async function publishCYPSet(id:string){
    try {
        await connectDB();
        const cyp = await CYPSet.findById(id);
        const update = await CYPSet.findByIdAndUpdate(id, {$set:{published:!cyp.published}}, {new:true});
        return handleResponse('Set updated successfully', false, update, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured publising the set', true, {}, 500)
    }
}


export async function getCYPSet(id:string){
    try {
        await connectDB();
        const cyp = await CYPSet.findById(id)
        .populate('sections')
        .lean();

        return JSON.parse(JSON.stringify(cyp));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the set', true, {}, 500)
    }
}


export async function getCYPSets(){
    try {
        await connectDB();
        const cyps = await CYPSet.find()
        .populate('sections')
        .populate('eventId')
        .lean();

        return JSON.parse(JSON.stringify(cyps));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the sets', true, {}, 500)
    }
}


export async function deleteCYPSet(id:string){
    try {
        await connectDB();

        await CYPSet.findByIdAndDelete(id);

        return handleResponse('Set Deleted Successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the set', true, {}, 500)
    }
}