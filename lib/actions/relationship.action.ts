'use server';

import Relationship, { IRelationship } from "../database/models/relationship.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createRelationship(relation:Partial<IRelationship>){
    try {
        await connectDB();
        const newRelation = await Relationship.create(relation);
        return handleResponse('Relationship created successfully', false, newRelation, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating the relationship', true, {}, 500);
    }
}

export async function updateRelationship(relation:Partial<IRelationship>){
    try {
        await connectDB();
        const {_id} = relation;
        const rel = await Relationship.findByIdAndUpdate(_id, relation, {new:true});
        return handleResponse('Relationship updated successfully', false, rel, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating the relationship', true, {}, 500);
    }
}

export async function getRelationship(id:string){
    try {
        await connectDB();
        const relation = await Relationship.findById(id)
        .populate('members')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(relation));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the relationship', true, {}, 500);
    }
}

export async function getRelationships() {
    try {
        await connectDB();
        const relations = await Relationship.find()
        .populate('members')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(relations));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the relationships', true, {}, 500);
    }
}


export async function getRelationshipsForChurch(churchId:string) {
    try {
        await connectDB();
        const relations = await Relationship.find({churchId})
        .populate('members')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(relations));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the relationships', true, {}, 500);
    }
}

export async function getMemberRelationship(memberId:string) {
    try {
        await connectDB();
        const relations = await Relationship.find({members: memberId})
        .populate('members')
        .lean();
        return JSON.parse(JSON.stringify(relations));
    } catch (error) {
        console.log(error);
        return handleResponse(`Error occured fetching relationships`, true, {}, 500);
    }
}

export async function deleteRelationship(id:string){
    try {
        await connectDB();
        await Relationship.deleteOne({_id:id});
        return handleResponse('Relationship deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting the relationship', true, {}, 500);
    }
}