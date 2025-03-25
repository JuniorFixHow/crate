'use server'

import Facility, { IFacility } from "../database/models/facility.model";
import Room from "../database/models/room.model";
import Venue from "../database/models/venue.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createFacility(facility:Partial<IFacility>){
    try {
        await connectDB;
        const {venueId} = facility;
        const vn = await Facility.create(facility);
        await Venue.findByIdAndUpdate(venueId, {$push:{facilities:vn._id}})
        return handleResponse('Facility created successfully', false, vn, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating facility', true, {}, 500)
    }
}


export async function createFacilities(facilities:Partial<IFacility>[]){
    try {
        await connectDB();
        const {venueId} = facilities[0];
        const createdFacs = await Facility.insertMany(facilities);
        const facIds = createdFacs.map((item:IFacility)=>item._id);
        await Venue.findByIdAndUpdate(venueId, {$push: {facilities: {$each:facIds}}})
        return handleResponse('Facilities created successfully', false, createdFacs, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating facilities', true, {}, 500)
    }
}

export async function updateFacility(facility:Partial<IFacility>){
    try {
        await connectDB();
        const {_id, rooms} = facility;
        const rms = await Room.countDocuments({facId:_id});
        if(rooms && (rms >= rooms)){
            return handleResponse('There are rooms more than the provided number of rooms for the facility. You may have to delete such rooms before you continue with the update', true, {}, 422);
        }
        const vn = await Facility.findOneAndUpdate({_id}, facility, {new:true});
        return handleResponse('Facility updated successfully', false, vn, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating facility', true, {}, 500)
    }
}



export async function getFacilities(){
    try {
        await connectDB();
        const facilitys = await Facility.find()
        .populate('venueId')
        .lean();
        return JSON.parse(JSON.stringify(facilitys));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching facilities', true, {}, 500)
    }
}

export async function getFacilitiesForaVenue(venueId:string){
    try {
        await connectDB();
        const facilitys = await Facility.find({venueId})
        .populate('venueId')
        .lean();
        return JSON.parse(JSON.stringify(facilitys));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching facilities', true, {}, 500)
    }
}

export async function getFacilitiesForaChurch(churchId:string){
    try {
        await connectDB();
        const facilitys = await Facility.find({churchId})
        .populate('venueId')
        .lean();
        return JSON.parse(JSON.stringify(facilitys));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching facilities', true, {}, 500)
    }
}

export async function getFacility(id:string){
    try {
        await connectDB();
        const facility = await Facility.findById(id)
        .populate('venueId')
        .lean();
        return JSON.parse(JSON.stringify(facility));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching facility', true, {}, 500)
    }
}


export async function deleteFacility(id:string){
    try {
        await connectDB();
        const facility = await Facility.findById(id);
        await Venue.findByIdAndUpdate(facility.venueId, {$pull:{facilities:facility._id}})
        await Facility.deleteOne({_id:id});
        return handleResponse('Facility deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting facility', true, {}, 500)
    }
}


export async function getAvailableFacilities(venueId: string) {
    try {
        await connectDB();

        // Fetch all facilities for the given venue ID
        const facilities = await Facility.find({ venueId });

        // Prepare an array to hold available facilities
        const availableFacilities = [];

        // Check room count for each facility
        for (const facility of facilities) {
            // Count the number of rooms created for the facility
            const createdRoomCount = await Room.countDocuments({ facId: facility._id });

            // Compare against the facility's 'rooms' property
            if (createdRoomCount < parseInt(facility.rooms, 10)) {
                availableFacilities.push(facility);
            }
        }

        return JSON.parse(JSON.stringify(availableFacilities));
    } catch (error) {
        console.error('Error fetching available facilities:', error);
        return handleResponse('Error fetching available facilities', true, {}, 500);
    }
}


