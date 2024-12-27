'use server'
import Contract from "../database/models/contract.model";
import Service, { IService } from "../database/models/service.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createService(service:Partial<IService>){
    try {
        await connectDB();
        const serv = await Service.create(service);
        return handleResponse('Service created successfully', false, serv, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating contract service', true, {}, 500)
    }
}


export async function updateService (service:Partial<IService>){
    try {
        await connectDB();
        const {_id, ...others} = service;
        const serv = await Service.findByIdAndUpdate(_id, others, {new:true});
        return handleResponse('Service updated successfully', false, serv, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured updating contract service', true, {}, 500)
    }
}

export async function getServices() {
    try {
        await connectDB();
        const services = await Service.find()
        return JSON.parse(JSON.stringify(services));
    } catch (error) {
        console.error('Error fetching services:', error);
        return handleResponse('Error occurred while fetching services', true, {}, 500);
    }
}

export async function getService(id:string) {
    try {
        await connectDB();
        const service = await Service.findById(id)
        return JSON.parse(JSON.stringify(service));
    } catch (error) {
        console.error('Error fetching services:', error);
        return handleResponse('Error occurred while fetching service', true, {}, 500);
    }
}


export async function getContractServices(contractId: string) {
    try {
        await connectDB();

        // Find the contract by ID and populate its services
        const contract = await Contract.findById(contractId).populate('services');

        if (!contract) {
            return handleResponse('Contract not found', true, {}, 404);
        }
        const services = contract.services;
        return JSON.parse(JSON.stringify(services));
    } catch (error) {
        console.error('Error fetching contract services:', error);
        return handleResponse('Error occurred while fetching services', true, {}, 500);
    }
}


export async function getContractsByService(serviceId: string) {
    try {
        await connectDB();

        // Find contracts that include the specified service ID
        const contracts = await Contract.find({ services: serviceId });

        if (contracts.length === 0) {
            return handleResponse('No contracts found using this service', true, [], 404);
        }

        return JSON.parse(JSON.stringify(contracts));
    } catch (error) {
        console.error('Error fetching contracts by service:', error);
        return handleResponse('Error occurred while fetching contracts', true, {}, 500);
    }
}




export async function deleteService(serviceId: string) {
    try {
        await connectDB();

        // Check if the service is being used by any contract
        const isServiceUsed = await Contract.exists({ services: serviceId });

        if (isServiceUsed) {
            return handleResponse(
                'Service cannot be deleted as it is being used in a contract',
                true,
                {},
                400
            );
        }

        // Proceed to delete the service
        const deletedService = await Service.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return handleResponse('Service not found', true, {}, 404);
        }

        return handleResponse('Service deleted successfully', false, {}, 200);
    } catch (error) {
        console.error('Error deleting service:', error);
        return handleResponse('Error occurred while deleting service', true, {}, 500);
    }
}

