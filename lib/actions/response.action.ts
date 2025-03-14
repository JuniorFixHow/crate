'use server'

import Response, { IResponse } from "../database/models/response.model";
import Section from "../database/models/section.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";
import '../database/models/member.model';
import '../database/models/cypset.model';
import '../database/models/question.model';
import '../database/models/cypset.model';
import Member from "../database/models/member.model";

export async function createResponse(response:Partial<IResponse>){
    try {
        await connectDB();
        const {sectionId} = response;
        const res = await Response.create(response);
        await Section.findByIdAndUpdate(sectionId, {$push:{responses:res._id}})
        return handleResponse('Response submitted successfully', false, res, 201)
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured submitting the response', true, {}, 500)
    }
}

export async function createResponses(responses:Partial<IResponse>[]){
    try {
        await connectDB();
        const {sectionId} = responses[0];
        const createdResponses = await Response.insertMany(responses, {ordered:false});
        const responseIds = createdResponses.map((r)=>r._id);
        await Section.findByIdAndUpdate(sectionId, {$push: {responses: {$each:responseIds}}})
        return handleResponse('Response submitted successfully', false, createdResponses, 201)
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured submitting the response', true, {}, 500)
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
        .populate('sectionId')
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
        .populate('sectionId')
        .lean();

        return JSON.parse(JSON.stringify(responses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the responses', true, {}, 500)
    }
}

export async function getResponsesForSet(cypsetId:string){
    try {
        await connectDB();
        const responses = await Response.find({cypsetId})
        .populate('sectionId')
        .populate('cypsetId')
        .populate('memberId')
        .populate('questionId')
        .lean();

        return JSON.parse(JSON.stringify(responses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the responses', true, {}, 500)
    }
}


export async function getResponsesForQuestion(questionId:string){
    try {
        await connectDB();
        const responses = await Response.find({questionId})
        .populate('sectionId')
        .populate('memberId')
        .populate('questionId')
        .populate('cypsetId')
        .lean();
        // console.log(responses)
        return JSON.parse(JSON.stringify(responses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the responses', true, {}, 500)
    }
}


export async function getResponsesForMember(memberId:string){
    try {
        await connectDB();
        const responses = await Response.find({memberId})
        .populate('sectionId')
        .populate('memberId')
        .populate('questionId')
        .populate('cypsetId')
        .lean();
        // console.log(responses)
        return JSON.parse(JSON.stringify(responses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the responses', true, {}, 500)
    }
}

export async function updateThem(){
    try {
        await connectDB();
        await Response.updateMany({}, {cypsetId:'67d03e9ed6e123ba48c12544'})
    } catch (error) {
        console.log(error);
    }
}

export async function getRespondentsForSet(cypsetId:string){
    try {
        await connectDB();
        const memberIds = await Response.distinct("memberId", { cypsetId });
        // console.log(memberIds);

        const members = await Member.find({ _id: { $in: memberIds } });

        // return members;
        // console.log(responses)
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the respondents', true, {}, 500)
    }
}


export async function deleteResponse(id:string){
    try {
        await connectDB();
        const response = await Response.findById(id);

        await Section.findByIdAndUpdate(response.sectionId, {$pull:{responses:response._id}})

        await Response.findByIdAndDelete(id);

        return handleResponse('Response Deleted Successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting the response', true, {}, 500)
    }
}