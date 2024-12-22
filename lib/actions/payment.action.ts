'use server'

import Payment, { IPayment } from "../database/models/payment.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createPayment (payment:Partial<IPayment>){
    try {
        await connectDB();
        const pay = await Payment.create(payment);
        return handleResponse('Payment made successfully', false, pay, 201);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occured making payment", true);
    }
}


export async function updatePayment (id:string, payment:Partial<IPayment>){
    try {
        await connectDB();
        const pay = await Payment.findByIdAndUpdate(id, payment, {new:true});
        return handleResponse('Payment updated successfully', false, pay, 201)
    } catch (error) {
        console.log(error)
        return handleResponse('Error occured updating payment', true)
    }
}


export async function getPayments() {
    try {
        await connectDB();

        const payments = await Payment.find()
            .populate('payee') // Populates the Vendor (payee) field
            .populate({
                path: 'payer', // Refers to the Registration field in Payment
                model: 'Registration',
                populate: [
                    {
                        path: 'memberId',
                        model: 'Member',
                        populate: {
                            path: 'church',
                            model: 'Church',
                            populate: {
                                path: 'zoneId',
                                model: 'Zone',
                            },
                        },
                    },
                    {
                        path: 'eventId',
                        model: 'Event',
                    },
                    {
                        path: 'groupId',
                        model: 'Group',
                    },
                    {
                        path: 'roomIds',
                        model: 'Room',
                    },
                ],
            })
            .lean();

        return JSON.parse(JSON.stringify(payments));
        // return handleResponse('Payments fetched successfully', false, payments, 200);
    } catch (error) {
        console.error('Error occurred fetching payments:', error);
        return handleResponse('Error occurred fetching payments', true, {}, 500);
    }
}


export async function getUserPayments(userId:string) {
    try {
        await connectDB();

        const payments = await Payment.find({payee:userId})
            .populate('payee') // Populates the Vendor (payee) field
            .populate({
                path: 'payer', // Refers to the Registration field in Payment
                model: 'Registration',
                populate: [
                    {
                        path: 'memberId',
                        model: 'Member',
                        populate: {
                            path: 'church',
                            model: 'Church',
                            populate: {
                                path: 'zoneId',
                                model: 'Zone',
                            },
                        },
                    },
                    {
                        path: 'eventId',
                        model: 'Event',
                    },
                    {
                        path: 'groupId',
                        model: 'Group',
                    },
                    {
                        path: 'roomIds',
                        model: 'Room',
                    },
                ],
            })
            .lean();

        return JSON.parse(JSON.stringify(payments));
        // return handleResponse('Payments fetched successfully', false, payments, 200);
    } catch (error) {
        console.error('Error occurred fetching payments:', error);
        return handleResponse('Error occurred fetching payments', true, {}, 500);
    }
}


export async function getPayment(id:string) {
    try {
        await connectDB();

        const payment = await Payment.findById(id)
            .populate('payee') // Populates the Vendor (payee) field
            .populate({
                path: 'payer', // Refers to the Registration field in Payment
                model: 'Registration',
                populate: [
                    {
                        path: 'memberId',
                        model: 'Member',
                        populate: {
                            path: 'church',
                            model: 'Church',
                            populate: {
                                path: 'zoneId',
                                model: 'Zone',
                            },
                        },
                    },
                    {
                        path: 'eventId',
                        model: 'Event',
                    },
                    {
                        path: 'groupId',
                        model: 'Group',
                    },
                    {
                        path: 'roomIds',
                        model: 'Room',
                    },
                ],
            })
            .lean();
        return JSON.parse(JSON.stringify(payment));
    } catch (error) {
        console.error('Error occurred fetching payment:', error);
        return handleResponse('Error occurred fetching payment', true, {}, 500);
    }
}


export async function deletePayment(id:string){
    try {
        await connectDB();
        await Payment.findByIdAndDelete(id);
        return handleResponse('Payment deleted successfully', true);
    } catch (error) {
        console.error('Error occurred deleting payment:', error);
        return handleResponse('Error occurred deleting payment', true, {}, 500);
    }
}