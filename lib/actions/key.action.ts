'use server'
import Key, { IKey } from "../database/models/key.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createKey(key:Partial<IKey>){
    try {
        await connectDB();
        const res = await Key.create(key);
        return handleResponse('Key created successfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating the key', true, {}, 500)
    }
}



export async function updateKey(id:string, key:Partial<IKey>){
    try {
        await connectDB();
        const res = await Key.findByIdAndUpdate(id, key, {new:true})
        return handleResponse('Key updated successfully', false, res, 201);
    } catch (error) {
        console.log(error)
        return handleResponse('Error occured updating the key', true, {}, 500)
    }
}


export async function returnKey(id:string){
    try {
        await connectDB();
        const key = await Key.findById(id);
        const update = await Key.findByIdAndUpdate(id, 
            {$set:{returned:!key.returned, returnedDate:new Date().toISOString()}}, 
            {new:true}
        );
        return handleResponse('Key status updated successfully', false, update, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating key return status', true, {}, 500);
    }
}


export async function getKeys(){
    try {
        await connectDB();
        const keys = await Key.find()
        .populate({
            path:'holder',
            populate:{
                path:'memberId',
                model:'Member'
            }
        })
        .populate('roomId')
        .lean();
        // console.log('Keys: ', keys)
        return JSON.parse(JSON.stringify(keys))
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching keys', true, {}, 500)
    }
}


export async function getKey(id:string){
    try {
        await connectDB();
        const key = await Key.findById(id)
        .populate({
            path:'holder',
            populate:{
                path:'memberId',
                model:'Member'
            }
        })
        .populate('roomId')
        .lean();
        return JSON.parse(JSON.stringify(key));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching key', true, {}, 500)
    }
}



export async function deleteKey(id:string){
    try {
        await connectDB();
        await Key.findByIdAndDelete(id);
        return handleResponse('Key deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting key', true, {}, 500)
    }
}