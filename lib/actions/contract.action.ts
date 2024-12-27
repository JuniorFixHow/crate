'use server'
import Church from "../database/models/church.model";
import Contract, { IContract } from "../database/models/contract.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createContract(contract:Partial<IContract>){
    try {
        await connectDB();
        const newContract =  await Contract.create(contract);
        return handleResponse('Contract created successfully', false, newContract, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating contract', true, {}, 500)
    }
}

export async function updateContract(contract:Partial<IContract>){
    try {
        await connectDB();
        const {_id} =  contract;
        const newContract =  await Contract.findByIdAndUpdate(_id, contract, {new:true});
        return handleResponse('Contract updated successfully', false, newContract, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating contract', true, {}, 500)
    }
}

export async function getContracts(){
    try {
        await connectDB();
        const contracts =  await Contract.find();
        return JSON.parse(JSON.stringify(contracts));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching contracts', true, {}, 500);
    }
}


export async function getUnusedContracts(){
    try {
        await connectDB();
        const usedContracts = await Church.distinct('contractId');
        // console.log('Contracts: ',usedContracts);

        const contracts =  await Contract.find({
            _id: { $nin: usedContracts }
        });
        return JSON.parse(JSON.stringify(contracts));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching contracts', true, {}, 500);
    }
}

export async function getContract(id:string){
    try {
        await connectDB();
        const contract =  await Contract.findById(id);
        return JSON.parse(JSON.stringify(contract));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching contract', true, {}, 500);
    }
}


export async function deleteContract(id:string){
    try {
        await connectDB();
        await Contract.findByIdAndDelete(id);
        return handleResponse('Contract deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting contract', true, {}, 500)
    }
}