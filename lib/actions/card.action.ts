'use server'

import Card, { ICard } from "../database/models/card.model";
import { handleResponse } from "../misc";
import '../database/models/church.model';
import '../database/models/member.model';
import { connectDB } from "../database/mongoose";

export async function createCard(card:Partial<ICard>){
    try {
        await connectDB();
        const act = await Card.create(card);
        return handleResponse('Card created successfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured creating card", true, {}, 500);
    }
}

export async function updateCard(card:Partial<ICard>){
    try {
        await connectDB();
        const {_id} = card;
        const act = await Card.findByIdAndUpdate(_id, card, {new:true});
        return handleResponse('Card updated sucessfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured updating card", true, {}, 500);
    }
}

export async function getCard(id:string){
    try {
        await connectDB();
        const act = await Card.findById(id)
        .populate('member')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(act));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching card", true, {}, 500);
    }
}


export async function getCards(){
    try {
        await connectDB();
        const acts = await Card.find()
        .populate('member')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(acts));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching cards", true, {}, 500);
    }
}
export async function getCardsForChurch(churchId:string){
    try {
        await connectDB();
        const acts = await Card.find({churchId})
        .populate('member')
        .populate('churchId')
        .lean();
        return JSON.parse(JSON.stringify(acts));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured fetching cards", true, {}, 500);
    }
}

export async function deleteCard(id:string){
    try {
        await connectDB();
        await Card.deleteOne({_id:id});
        return handleResponse('Card deleted successfully', false);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured deleting card", true, {}, 500);
    }
}