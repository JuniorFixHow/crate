'use server'

import Venue, { IVenue } from "../database/models/venue.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";
import '../database/models/church.model'
import '../database/models/facility.model'

export async function createVenue(venue:Partial<IVenue>){
    try {
        await connectDB;
        const vn = await Venue.create(venue);
        return handleResponse('Venue created successfully', false, vn, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating venue', true, {}, 500)
    }
}


export async function updateVenue(venue:Partial<IVenue>){
    try {
        await connectDB();
        const {_id} = venue;
        const vn = await Venue.findOneAndUpdate({_id}, venue, {new:true});
        return handleResponse('Venue updated successfully', false, vn, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating venue', true, {}, 500)
    }
}


export async function getVenues(){
    try {
        await connectDB();
        const venues = await Venue.find()
        .populate('facilities')
        .lean();
        return JSON.parse(JSON.stringify(venues));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching venues', true, {}, 500)
    }
}


export async function getVenuesForChurch(churchId:string){
    try {
        await connectDB();
        const venues = await Venue.find({churchId})
        .populate('facilities')
        .lean();
        return JSON.parse(JSON.stringify(venues));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching venues', true, {}, 500)
    }
}

export async function getVenue(id:string){
    try {
        await connectDB();
        const venue = await Venue.findById(id)
        .populate('facilities')
        .lean();
        return JSON.parse(JSON.stringify(venue));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching venue', true, {}, 500)
    }
}


export async function deleteVenue(id:string){
    try {
        await connectDB();
        await Venue.deleteOne({_id:id});
        return handleResponse('Venue deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting venue', true, {}, 500)
    }
}