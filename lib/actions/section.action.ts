'use server'
import mongoose from "mongoose";
import CYPSet from "../database/models/cypset.model";
import Question, { IQuestion } from "../database/models/question.model";
import Section, { ISection } from "../database/models/section.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createSection(section:Partial<ISection>){
    try {
        await connectDB();
        const {cypsetId} = section;
        const lastSection = await Section.findOne({cypsetId}).sort({number:-1});
        const sectionNumber = lastSection?.number ? lastSection?.number + 1 : 1;
        const newSection = new Section({...section, number:sectionNumber});
        const res =  await newSection.save();
        await CYPSet.findByIdAndUpdate(res.cypsetId, {$push:{sections:res?._id}});
        return handleResponse('Section created successfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating section', true)
    }
}


export async function updateSection(id:string, section:Partial<ISection>){
    try {
        await connectDB();
        const res = await Section.findByIdAndUpdate(id, section, {new:true})
        return handleResponse('Section updated successfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating section', true)
    }
}


export async function deleteAndSaveQuestionsForSection(sectionId:string, questions:Partial<IQuestion>[]){
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await Question.deleteMany({ sectionId }).session(session);
        await Section.findByIdAndUpdate(sectionId, { $set: { questions: [] } }).session(session);
        const createdQuestions = await Question.insertMany(questions, { session });
        const questionIds = createdQuestions.map((q) => q._id);
        await Section.findByIdAndUpdate(sectionId, { $push: { questions: { $each: questionIds } } }).session(session);
        await session.commitTransaction();
        session.endSession();
        return handleResponse(`${createdQuestions.length} questions saved for the section`, false, createdQuestions, 201);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return handleResponse("Error occurred updating section", true);
    }

}


export async function getSections(){
    try {
        await connectDB();
        const sections = await Section.find()
        .populate('questions')
        .populate('responses')
        .populate('cypsetId')
        .lean();
        return JSON.parse(JSON.stringify(sections));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching sections', true)
    }
}

export async function getSectionsForChurch(churchId:string){
    try {
        await connectDB();
        const sections = await Section.find({churchId})
        .populate('questions')
        .populate('responses')
        .populate('cypsetId')
        .lean();
        return JSON.parse(JSON.stringify(sections));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching sections', true)
    }
}

export async function getSection(id:string){
    try {
        await connectDB();
        const section = await Section.findById(id)
        .populate('questions')
        .populate('responses')
        .populate('cypsetId')
        .lean();
        return JSON.parse(JSON.stringify(section));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching section', true)
    }
}

export async function getSectionsForSet(cypsetId:string){
    try {
        await connectDB();
        const sections = await Section.find({cypsetId});
        return JSON.parse(JSON.stringify(sections));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching sections', true)
    }
}


export async function getSectionsWithQuestions(){
    try {
        await connectDB();
        const sections = await Section.find({ questions: { $exists: true, $ne: [] } }).populate('cypsetId').lean();
        return JSON.parse(JSON.stringify(sections));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching sections', true)
    }
}

export async function getSectionsWithQuestionsForChurch(churchId:string){
    try {
        await connectDB();
        const sections = await Section.find({ questions: { $exists: true, $ne: [] }, churchId })
        .populate('cypsetId').lean();
        return JSON.parse(JSON.stringify(sections));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching sections', true)
    }
}


export async function deleteSection(id: string) {
    try {
        await connectDB();

        // Find the section to be deleted
        const section = await Section.findById(id);
        if (!section) {
            return handleResponse('Section not found', true, {}, 404);
        }

        // Remove the section from the CYPSet's sections array
        await CYPSet.findByIdAndUpdate(section.cypsetId, { $pull: { sections: section._id } });

        // Delete the section
        await Section.deleteOne({_id:id});

        // Reorder the remaining sections
        const remainingSections = await Section.find({ cypsetId: section.cypsetId }).sort({ number: 1 });

        // Update the number property for each section
        for (let i = 0; i < remainingSections.length; i++) {
            await Section.findByIdAndUpdate(remainingSections[i]._id, { number: i + 1 });
        }

        return handleResponse('Section deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occurred deleting section', true, {}, 500);
    }
}
