'use server';
import ClassMinistry, { IClassministry } from "../database/models/classministry.model";
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

export async function getClassministries(){
    try {
        await connectDB();
        const response = await ClassMinistry.find();
        return handleResponse('', false, response, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching ministry', true, {}, 500);
    }
}


export async function getChurchClassministries(churchId:string){
    try {
        await connectDB();
        const response = await ClassMinistry.find({churchId});
        return handleResponse('', false, response, 200);
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