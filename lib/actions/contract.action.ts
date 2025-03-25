'use server'
import Church from "../database/models/church.model";
import Contract, { IContract } from "../database/models/contract.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";
import '../database/models/service.model';
import mongoose from "mongoose";

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
        const contracts =  await Contract.find()
        .populate('services').lean();
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
        })
        .populate('services').lean();
        return JSON.parse(JSON.stringify(contracts));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching contracts', true, {}, 500);
    }
}

export async function getContract(id:string){
    try {
        await connectDB();
        const contract =  await Contract.findById(id)
        .populate('services').lean();
        return JSON.parse(JSON.stringify(contract));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching contract', true, {}, 500);
    }
}


export async function deleteContract(id: string) {
    try {
        await connectDB();

        // Check if contract exists before deletion
        const contract = await Contract.findById(id);
        if (!contract) {
            return handleResponse("Contract not found", true, {}, 404);
        }

        // Start a transaction (optional but useful for consistency)
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await Contract.findByIdAndDelete(id, { session });
            await Church.updateMany({ contractId: id }, { $unset: { contractId: "" } }, { session });

            await session.commitTransaction();
            session.endSession();

            return handleResponse("Contract deleted successfully", false, {}, 200);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error("Error deleting contract:", error);
        return handleResponse("Error occurred while deleting contract", true, {}, 500);
    }
}