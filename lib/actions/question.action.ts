'use server'

import Question, { IQuestion } from "../database/models/question.model";
import Section from "../database/models/section.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";


export async function createQuestions(questions: Partial<IQuestion>[]) {
  try {
    // Ensure connection to the database
    await connectDB();

    // Validate input and extract the sectionId
    if (!questions.length) {
      return handleResponse("No questions provided", true, {}, 400);
    }

    const sectionId = questions[0].sectionId;
    if (!sectionId) {
      return handleResponse("Section ID is required for all questions", true, {}, 400);
    }

    // Create questions in bulk
    const createdQuestions = await Question.insertMany(questions, {ordered:false});

    // Update the section with the new questions
    const questionIds = createdQuestions.map((q) => q._id);
    await Section.findByIdAndUpdate(sectionId, { $push: { questions: { $each: questionIds } } });

    return handleResponse(
      `${createdQuestions.length} Questions created successfully`,
      false,
      createdQuestions,
      201
    );
  } catch (error) {
    console.error(error);
    return handleResponse("Error occurred while creating questions", true, {}, 500);
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
        .populate('sectionId')
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
        .populate('sectionId')
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

        await Section.findByIdAndUpdate(question.sectionId, {$pull:{questions:question._id}}) 
        await Question.deleteOne({_id:id});

        return handleResponse('Question Deleted Successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting the question', true, {}, 500)
    }
}