'use server'

import CYPSet from "../database/models/cypset.model";
import Question, { IQuestion } from "../database/models/question.model";
import Response from "../database/models/response.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createCpySet(question:Partial<IQuestion>){
    try {
        await connectDB();
        const {cypsetId} = question;
        const res = await Question.create(question);
        await CYPSet.findByIdAndUpdate(cypsetId, {$push:{questions:res._id}})
        return handleResponse('Question created successfully', false, res, 201)
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating the set', true, {}, 500)
    }
}

export async function updateQuestion(id:string, question:Partial<IQuestion>){
    try {
        await connectDB();
        const res = await Question.findByIdAndUpdate(id, question, {new:true});
        return handleResponse('Question updated successfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating the question', true, {}, 500)
    }
}



export async function getQuestion(id:string){
    try {
        await connectDB();
        const questions = await Question.findById(id)
        .populate('cypsetId')
        .lean();
        return JSON.parse(JSON.stringify(questions));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the question', true, {}, 500)
    }
}


export async function getQuestions(){
    try {
        await connectDB();
        const cyps = await Question.find()
        .populate('cypsetId')
        .lean();

        return JSON.parse(JSON.stringify(cyps));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the questions', true, {}, 500)
    }
}


export async function deleteQuestion(id:string){
    try {
        await connectDB();
        const question = await Question.findById(id);

        await Promise.all([
            Response.deleteMany({questionId:question._id}),
            CYPSet.findByIdAndUpdate(question.cypsetId, {$pull:{questions:question._id}})
        ])

        await Question.findByIdAndDelete(id);

        return handleResponse('Question Deleted Successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting the question', true, {}, 500)
    }
}