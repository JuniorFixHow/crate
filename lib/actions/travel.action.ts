'use server'

import Event from "../database/models/event.model";
import TravelHub, { ITravelhub } from "../database/models/travelhub.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";
import '../database/models/registration.model';
import '../database/models/member.model';
import '../database/models/church.model';
import '../database/models/event.model';

export async function createTravelHub(hub:Partial<ITravelhub>) {
    try {
        await connectDB();
        await TravelHub.create(hub);
        return handleResponse('Travel item added successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating travel item', true, {}, 500);
    }
}


export async function updateTravelHub(hub:Partial<ITravelhub>) {
    try {
        await connectDB();
        const {_id} = hub;
        await TravelHub.findByIdAndUpdate(_id, hub, {new:true});
        return handleResponse('Travel item updated successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updated travel item', true, {}, 500);
    }
}


export async function getTravelHub(id:string){
    try {
        await connectDB();
        const hub = await TravelHub.findById(id)
        .populate({
            path:'regId',
            populate:{
                path:'memberId',
                model:'Member',
                populate:{
                    path:'church',
                    model:'Church'
                }
            }
        })
        .populate('eventId')
        .lean();
        return JSON.parse(JSON.stringify(hub));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching travel item', true, {}, 500);
    }
}


export async function getTravelHubs(){
    try {
        await connectDB();
        const hubs = await TravelHub.find()
        .populate({
            path:'regId',
            populate:{
                path:'memberId',
                model:'Member',
                populate:{
                    path:'church',
                    model:'Church'
                }
            }
        })
        .populate('eventId')
        .lean();
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching travel items', true, {}, 500);
    }
}


export async function getTravelHubsForChurch(churchId:string){
    try {
        await connectDB();
        const hubs = await TravelHub.find({churchId})
        .populate({
            path:'regId',
            populate:{
                path:'memberId',
                model:'Member',
                populate:{
                    path:'church',
                    model:'Church'
                }
            }
        })
        .populate('eventId')
        .lean();
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching travel items', true, {}, 500);
    }
}

export async function getTravelHubsForChurchInAnEvent(churchId:string, eventId:string){
    try {
        await connectDB();
        const hubs = await TravelHub.find({churchId, eventId})
        .populate({
            path:'regId',
            populate:{
                path:'memberId',
                model:'Member',
                populate:{
                    path:'church',
                    model:'Church'
                }
            }
        })
        .populate('eventId')
        .lean();
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching travel items', true, {}, 500);
    }
}


export async function getTravelForEvent(eventId:string){
    try {
        await connectDB();
        const travels = await TravelHub.find({eventId})
        .populate({
            path:'regId',
            populate:{
                path:'memberId',
                model:'Member',
                populate:{
                    path:'church',
                    model:'Church'
                }
            }
        })
        .populate('eventId')
        .lean();
        return JSON.parse(JSON.stringify(travels));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching travel items', true, {}, 500);
    }
}


export async function deleteTravelHub(id:string){
    try {
        await connectDB();
        const hub = await TravelHub.findById(id);
        if (!hub) return handleResponse('TravelHub not found', true, {}, 404);
        await TravelHub.deleteOne({_id:id});
        await Event.updateMany({travelhubs: id}, {$pull: {travelhubs:id}} );
        return handleResponse('Travel item deleted successfully', false, {}, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing travel item', true,{}, 500);
    }
}