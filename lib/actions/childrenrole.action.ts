'use server'

import Childrenrole, { IChildrenrole } from "../database/models/childrenrole.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createChildrenrole(role:Partial<IChildrenrole>){
    try {
        await connectDB();
        await Childrenrole.create(role);
        return handleResponse('Role created successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating the role', true, {}, 500);
    }
}


export async function updateChildrenrole(role:Partial<IChildrenrole>){
    try {
        await connectDB();
        const {_id} = role;
        await Childrenrole.findByIdAndUpdate(_id, role, {new:true});
        return handleResponse('Role updated successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating the role', true, {}, 500);
    }
}


export async function getChildrenrole(id:string){
    try {
        await connectDB();
        const role = await Childrenrole.findById(id);
        return JSON.parse(JSON.stringify(role));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the role', true, {}, 500);
    }
}

export async function getChildrenroles(){
    try {
        await connectDB();
        const roles = await Childrenrole.find().populate('memberId').lean();
        return JSON.parse(JSON.stringify(roles));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the roles', true, {}, 500);
    }
}

export async function getChildrenrolesByClass(classId:string){
    try {
        await connectDB();
        const roles = await Childrenrole.find({classId})
        .populate({
            path:'memberId',
            populate:{
                path:'church',
                model:'Church'
            }
        })
        .lean();
        return JSON.parse(JSON.stringify(roles));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the roles', true, {}, 500);
    }
}


export async function deleteChildrenrole(id:string){
    try {
        await connectDB();
        await Childrenrole.deleteOne({_id:id});
        return handleResponse('Role deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the role', true, {}, 500);
    }
}