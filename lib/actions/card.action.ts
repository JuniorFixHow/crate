'use server'

import Card, { ICard } from "../database/models/card.model";
import { handleResponse } from "../misc";
import '../database/models/church.model';
import '../database/models/member.model';

export async function createCard(card:Partial<ICard>){
    try {
        const act = await Card.create(card);
        return handleResponse('Card created successfully', false, act, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured creating card", true, {}, 500);
    }
}

export async function updateCard(card:Partial<ICard>){
    try {
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

export async function deleteCard(id:string){
    try {
        const act = await Card.deleteOne({_id:id});
        return JSON.parse(JSON.stringify(act));
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured deleting card", true, {}, 500);
    }
}