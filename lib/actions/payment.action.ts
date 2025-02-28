'use server'

import { AdultsRange, ChildrenRange } from "@/components/Dummy/contants";
import Event, { IEvent } from "../database/models/event.model";
import Member from "../database/models/member.model";
import Payment, { IPayment } from "../database/models/payment.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";
import { IExpectedRevenue } from "@/types/Types";
import  { IChurch } from "../database/models/church.model";

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
            .populate('churchId') 
            .populate('eventId') 
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
            for (const payment of payments) {
                if (!payment.payer && payment.churchId && payment.eventId) {
                    const expectedRevenue = await getChurchExpectedRevenue(payment.eventId._id.toString(), payment.churchId._id.toString()) as number;
                    payment.dueAmount = expectedRevenue - (payment.amount || 0);
                } else {
                    payment.dueAmount = 0; // No due amount if payer is not null
                }
            }

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
            .populate('churchId') 
            .populate('eventId') 
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

            for (const payment of payments) {
                if (!payment.payer && payment.churchId && payment.eventId) {
                    const expectedRevenue = await getChurchExpectedRevenue(payment.eventId._id.toString(), payment.churchId._id.toString()) as number;
                    payment.dueAmount = expectedRevenue - (payment.amount || 0);
                } else {
                    payment.dueAmount = 0; // No due amount if payer is not null
                }
            }

        return JSON.parse(JSON.stringify(payments));
        // return handleResponse('Payments fetched successfully', false, payments, 200);
    } catch (error) {
        console.error('Error occurred fetching payments:', error);
        return handleResponse('Error occurred fetching payments', true, {}, 500);
    }
}

export async function getChurchPayments(churchId:string) {
    try {
        await connectDB();

        const payments = await Payment.find({churchId})
            .populate('payee') // Populates the Vendor (payee) field
            .populate('churchId') 
            .populate('eventId') 
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

            for (const payment of payments) {
                if (!payment.payer && payment.churchId && payment.eventId) {
                    const expectedRevenue = await getChurchExpectedRevenue(payment.eventId._id.toString(), payment.churchId._id.toString()) as number;
                    payment.dueAmount = expectedRevenue - (payment.amount || 0);
                } else {
                    payment.dueAmount = 0; // No due amount if payer is not null
                }
            }

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
            .populate('churchId')
            .populate('eventId')
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
            .lean() as unknown as IPayment;

            // for (const payment of payments) {
            // }
            if (!payment?.payer && payment.churchId && payment.eventId) {
                const event = payment.eventId as IEvent;
                const church = payment.churchId as IChurch;
                const expectedRevenue = await getChurchExpectedRevenue(event?._id, church?._id) as number;
                payment.dueAmount = expectedRevenue - (payment.amount || 0);
            } else {
                payment.dueAmount = 0; // No due amount if payer is not null
            }
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
        return handleResponse('Payment deleted successfully', false);
    } catch (error) {
        console.error('Error occurred deleting payment:', error);
        return handleResponse('Error occurred deleting payment', true, {}, 500);
    }
}


export async function getEventEstimatedRevenue(eventId: string) {
    try {
        await connectDB();

        // Fetch the event details to get the pricing
        const event = await Event.findById(eventId).select("adultPrice childPrice");

        if (!event) {
            return handleResponse("Event not found", true, {}, 404);
        }

        // Fetch all members with their churches
        const members = await Member.find()
            .populate('church')
            .select("ageRange church");

        // Define a map to accumulate revenue per church
        const revenueMap = new Map<string, IExpectedRevenue>();

        // Loop through members and calculate revenue
        members.forEach((member) => {
            const church = member.church as IChurch;
            const churchId = church._id.toString();

            // Initialize church revenue if not exists
            if (!revenueMap.has(churchId)) {
                revenueMap.set(churchId, {
                    adp: event.adultPrice || 0,
                    chp: event.childPrice || 0,
                    children: 0,
                    adults: 0,
                    total: 0,
                    church: church
                });
            }

            const revenue = revenueMap.get(churchId);
            if (!revenue) return;

            if (ChildrenRange.includes(member.ageRange)) {
                revenue.children += event.childPrice || 0;
            } else if (AdultsRange.includes(member.ageRange)) {
                revenue.adults += event.adultPrice || 0;
            }
            revenue.total = revenue.children + revenue.adults;
        });

        // Convert map values to array
        const result = Array.from(revenueMap.values());

        return handleResponse("Estimated revenue calculated successfully", false, result, 200);
    } catch (error) {
        console.log(error);
        return handleResponse("Error occurred retrieving data", true, {}, 500);
    }
}



export async function getChurchExpectedRevenue(eventId: string, churchId: string) {
    try {
        await connectDB();

        // Fetch event pricing
        const event = await Event.findById(eventId).select("adultPrice childPrice");
        if (!event) {
            return handleResponse("Event not found", true, {}, 404);
        }

        // Fetch members belonging to the given church
        const members = await Member.find({ church: churchId }).select("ageRange");

        // Count children and adults
        const childrenCount = members.filter(member => ChildrenRange.includes(member.ageRange)).length;
        const adultsCount = members.filter(member => AdultsRange.includes(member.ageRange)).length;

        // Calculate revenue
        const childrenRevenue = childrenCount * event.childPrice;
        const adultsRevenue = adultsCount * event.adultPrice;
        const totalRevenue = childrenRevenue + adultsRevenue;

       

        return totalRevenue;
    } catch (error) {
        console.log(error);
        return handleResponse("Error occurred retrieving data", true, {}, 500);
    }
}
