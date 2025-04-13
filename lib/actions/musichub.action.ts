'use server'

import Event, { IEvent } from "../database/models/event.model";
import MusicHub, { IMusichub } from "../database/models/musichub.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createMusicHub(hub:Partial<IMusichub>) {
    try {
        await connectDB();
        await MusicHub.create(hub);
        return handleResponse('Music item added successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating music item', true, {}, 500);
    }
}


export async function updateMusicHub(hub:Partial<IMusichub>) {
    try {
        await connectDB();
        const {_id} = hub;
        await MusicHub.findByIdAndUpdate(_id, hub, {new:true});
        return handleResponse('Music item updated successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updated music item', true, {}, 500);
    }
}


export async function getMusicHub(id:string){
    try {
        await connectDB();
        const hub = await MusicHub.findById(id);
        return JSON.parse(JSON.stringify(hub));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching music item', true, {}, 500);
    }
}


export async function getMusicHubs(){
    try {
        await connectDB();
        const hubs = await MusicHub.find();
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching music items', true, {}, 500);
    }
}


export async function getMusicHubsForChurch(churchId:string){
    try {
        await connectDB();
        const hubs = await MusicHub.find({churchId});
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching music items', true, {}, 500);
    }
}


export async function getMusicHubEvents(hubId:string){
    try {
        await connectDB();
        const events = await Event.find({musichubs:hubId});
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching events', true, {}, 500);
    }
}


export async function getEventMusicHubs(eventId:string){
    try {
        await connectDB();
        const event = await Event.findById(eventId)
        .populate('musichubs')
        .lean() as unknown as IEvent;
        const hubs = event?.musichubs;
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching music items', true, {}, 500);
    }
}


export async function addMusicHubToEvent(hubIds:string[], eventId:string){
    try {
        await connectDB();
        await Event.findByIdAndUpdate(eventId,{
            $addToSet: { musichubs: { $each: hubIds } }
        });
        return handleResponse('Event updated successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating event', true, {}, 500);
    }
}



export async function removeMusicHubFromEvent(hubIds:string[], eventId:string){
    try {
        await connectDB();
        await Event.findByIdAndUpdate(eventId,{
            $pull: {musichubs: {$in:hubIds}}
        });
        return handleResponse('Event updated successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating event', true, {}, 500);
    }
}


export async function removeMusicHubFromEvents(id:string){
    try {
        await connectDB();
        const hub = await MusicHub.findById(id);
        if (!hub) return handleResponse('MusicHub not found', true, {}, 404);
        await Event.updateMany({musichubs: id}, {$pull: {musichubs:id}} );
        return handleResponse('Music item removed from all events successfully', false, {}, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing music item', true,{}, 500);
    }
}


export async function deleteMusicHub(id:string){
    try {
        await connectDB();
        const hub = await MusicHub.findById(id);
        if (!hub) return handleResponse('MusicHub not found', true, {}, 404);
        await MusicHub.deleteOne({_id:id});
        await Event.updateMany({musichubs: id}, {$pull: {musichubs:id}} );
        return handleResponse('Music item deleted successfully', false, {}, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured removing music item', true,{}, 500);
    }
}