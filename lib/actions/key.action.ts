'use server'
import Key, { IKey } from "../database/models/key.model";
import Registration from "../database/models/registration.model";
import Room from "../database/models/room.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createKey(key:Partial<IKey>){
    try {
        await connectDB();
        const {holder} = key;
        const res = await Key.create(key);
        if(holder){
            await Registration.findByIdAndUpdate(holder, {$set:{keyId:res._id}});
        }
        return handleResponse('Key created successfully', false, res, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating the key', true, {}, 500)
    }
}



export async function updateKey(id:string, key:Partial<IKey>){
    try {
        await connectDB();
        const {holder} = key;
        const k = await Key.findById(id);
        if((holder && k?.holder) && (holder !== k.holder)){
            await Registration.findByIdAndUpdate(k?.holder, {$unset:{keyId:''}});
        }
        const res = await Key.findByIdAndUpdate(id, key, {new:true})
        if(holder){
            await Registration.findByIdAndUpdate(holder, {$set:{keyId:res._id}})
        }
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
        .populate({
            path:'roomId',
            populate:[
                {
                    path:'eventId',
                    model:'Event'
                },
                {
                    path:'venueId',
                    model:'Venue'
                },
            ]
        })
        .lean();
        // console.log('Keys: ', keys)
        return JSON.parse(JSON.stringify(keys))
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching keys', true, {}, 500)
    }
}

export async function getKeysForChurch(churchId:string){
    try {
        await connectDB();
        const rooms = await Room.find({churchId}).select('_id');
        const roomIds = rooms.map((item)=>item?._id);
        const keys = await Key.find({roomId: {$in:roomIds}})
        .populate({
            path:'holder',
            populate:{
                path:'memberId',
                model:'Member'
            }
        })
        .populate({
            path:'roomId',
            populate:[
                {
                    path:'eventId',
                    model:'Event'
                },
                {
                    path:'venueId',
                    model:'Venue'
                },
            ]
        })
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
        const key = await Key.findById(id);
        await Registration.findByIdAndUpdate(key.holder, {$unset:{keyId:''}});
        await Key.deleteOne({_id:id});
        return handleResponse('Key deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting key', true, {}, 500)
    }
}