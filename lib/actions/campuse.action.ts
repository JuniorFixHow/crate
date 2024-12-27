'use server'
import Campuse, { ICampuse } from "../database/models/campuse.model";
import Church from "../database/models/church.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createCampuses(campuses:Partial<ICampuse>[]){
    try {
        await connectDB();
        const {churchId} = campuses[0];
        const createdCampuses = await Campuse.insertMany(campuses);
        const campuseIds = createdCampuses.map((item)=>item._id);
        const updateChurch  = await Church.findByIdAndUpdate(churchId, {$push: { campuses: {$each: campuseIds} } }, {new:true});
        return handleResponse('Campuses created successfully', false, updateChurch, 201);
    } catch (error) {
        console.log(error)
        return handleResponse('Error occured creating campuses', true)
    }
}

export async function createCampuse(campuse:Partial<ICampuse>){
    try {
        await connectDB();
        const {churchId} = campuse;
        const createdCampuse = await Campuse.create(campuse);
        const updateChurch  = await Church.findByIdAndUpdate(churchId, {$push: { campuses: createdCampuse._id } }, {new:true});
        return handleResponse('Campus created successfully', false, updateChurch, 201);
    } catch (error) {
        console.log(error)
        return handleResponse('Error occured creating campus', true)
    }
}

export async function updateCampuse(campuse:Partial<ICampuse>){
    try {
        await connectDB();
        const {_id} = campuse;
        const cp = await Campuse.findByIdAndUpdate(_id, campuse, {new:true});
        return handleResponse('Campus updated successfully', false, cp, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating campus', true, {}, 500);
    }
}

export async function getCampuses(){
    try {
        await connectDB();
        const campuses = await Campuse.find()
        .populate({
            path:'churchId',
            populate:{
                path:'zoneId',
                model:'Zone'
            }
        })
        .populate('members')
        .lean();
        return JSON.parse(JSON.stringify(campuses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching campuses', true);
    }
}


export async function getCampuse(id:string){
    try {
        await connectDB();
        const campuses = await Campuse.findById(id)
        .populate({
            path:'churchId',
            populate:{
                path:'zoneId',
                model:'Zone'
            }
        })
        .populate('members')
        .lean();
        return JSON.parse(JSON.stringify(campuses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching campuses', true);
    }
}


export async function getChurchCampuses(churchId:string){
    try {
        await connectDB();
        const campuses = await Campuse.find({churchId})
        .populate('members')
        .populate({
            path:'churchId',
            populate:{
                path:'zoneId',
                model:'Zone'
            }
        })
        .lean();
        return JSON.parse(JSON.stringify(campuses));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching campuses', true);
    }
}


export async function deleteCampuse(id:string){
    try {
        await connectDB();
        const campus = await Campuse.findById(id);
        await Church.findByIdAndUpdate(campus.churchId, {$pull:{campuses:id}});
        await Campuse.deleteOne({_id:id});
        return handleResponse('Campus deleted successfully', false, {}, 200);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting campuse', true)
    }
}

