'use server'

import Group from "../database/models/group.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function getGroupLenght(eventId?: string) {
    try {
        await connectDB(); // Ensure this is awaited
        const length = await Group.countDocuments(eventId ? { eventId } : {});
        return { length };
    } catch (error) {
        console.error('Error fetching group length:', error);
        throw new Error('Error occurred fetching data'); // Explicitly throw to propagate the error
    }
}



export async function getNextGroupNumber() {
    try {
        await connectDB();

        const groups = await Group.countDocuments({});
        
        // If no group exists, default to 1
        let nextGroupNumber;
        if(groups > 0){
            const lastGroup = await Group.findOne().sort({ groupNumber: -1 }); // Get the latest group by groupNumber
            nextGroupNumber = lastGroup?.groupNumber ? lastGroup.groupNumber + 1 : 1;
        }
        else{
            nextGroupNumber = 1;
        }
        
        // console.log('Groups', nextGroupNumber)
        return {nextGroupNumber};
    } catch (error) {
        console.error('Error fetching next group number:', error);
        throw new Error('Error occurred while fetching next group number');
    }
}

