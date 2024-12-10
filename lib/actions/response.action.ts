'use server'

import CYPSet from "../database/models/cypset.model";
import Response, { IResponse } from "../database/models/response.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createCpySet(response:Partial<IResponse>){
    try {
        await connectDB();
        const {cypsetId} = response;
        const res = await Response.create(response);
        await CYPSet.findByIdAndUpdate(cypsetId, {$push:{responses:res._id}})
        return handleResponse('Response created successfully', false, res, 201)
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating the response', true, {}, 500)
    }
}

export async function updateResponse(id:string, response:Partial<IResponse>){
    try {
        await connectDB();
        const res = await Response.findByIdAndUpdate(id, response, {new:true});
        return handleResponse('Response updated successfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating the response', true, {}, 500)
    }
}



export async function getResponse(id:string){
    try {
        await connectDB();
        const responses = await Response.findById(id)
        .populate('cypsetId')
        .populate('questionId')
        .lean();
        return JSON.parse(JSON.stringify(responses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the response', true, {}, 500)
    }
}


export async function getResponses(){
    try {
        await connectDB();
        const responses = await Response.find()
        .populate('cypsetId')
        .populate('questionId')
        .lean();

        return JSON.parse(JSON.stringify(responses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the responses', true, {}, 500)
    }
}


export async function deleteResponse(id:string){
    try {
        await connectDB();
        const response = await Response.findById(id);

        await CYPSet.findByIdAndUpdate(response.cypsetId, {$pull:{responses:response._id}})

        await Response.findByIdAndDelete(id);

        return handleResponse('Response Deleted Successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting the response', true, {}, 500)
    }
}