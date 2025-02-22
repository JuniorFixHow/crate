'use server'
import CAttendance from "../database/models/classattendance.model";
// import Attendance from "../database/models/attendance.model";
// import Event from "../database/models/event.model";
// import Registration from "../database/models/registration.model";
import CSession, { IClasssession } from "../database/models/classsession.model";
import Ministry from "../database/models/ministry.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createCSession(session:Partial<IClasssession>){
    try {
        await connectDB();
        const newCSession = await CSession.create(session);
        // await Event.findByIdAndUpdate(newCSession.eventId, {
        //     $inc:{sessions:1}
        // }, {new:true});
        return handleResponse( 'Session created successfully', false, newCSession, 201);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating session:', error.message);
            return handleResponse('Error occured creating session', true, {}, 500);
        } else {
            console.error('Unknown error:', error);
            return handleResponse('Error occured creating session', true, {}, 500);
        }
    }
}

export async function updateCSession(id: string, session: Partial<IClasssession>) {
    try {
        await connectDB();

        const sess = await CSession.findByIdAndUpdate(id, session, { new: true });

        // if (!sess) {
        //     throw new Error('CSession not found');
        // }

        // const sessions = await CSession.countDocuments({ eventId: sess.eventId });

        // await Event.findByIdAndUpdate(sess.eventId, { sessions }, { new: true });

        return handleResponse('Session created successfully', false, sess, 201);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating session:', error.message);
            return handleResponse('Error occured updating session', true, {}, 500);
        } else {
            console.error('Unknown error:', error);
            return handleResponse('Error occured updating session', true, {}, 500);
        }
    }
}


export async function getCSession(id:string){
    try {
        await connectDB();
        const sess = await CSession.findById(id).populate('classId').populate('createdBy').lean();
        return JSON.parse(JSON.stringify(sess));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching session:', error.message);
            throw new Error(`Error occurred during session fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during session fetch');
        }
    }
}


export async function getCSessions(){
    try {
        await connectDB();
        const sess = await CSession.find().populate('classId').populate('createdBy').lean();
        
        return JSON.parse(JSON.stringify(sess));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching sessions:', error.message);
            throw new Error(`Error occurred during sessions fetch: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during sessions fetch');
        }
    }
}

export async function getUserCSessions(id: string, userId: string) {
    try {
        await connectDB();
        const sessions = await CSession.find({ classId: id, createdBy: userId })
            .populate('classId')
            .populate('createdBy')
            .lean(); // Use lean() for plain JS objects

        return JSON.parse(JSON.stringify(sessions));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching user sessions:', error.message);
            throw new Error(`Error occurred while fetching user sessions: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('An unknown error occurred while fetching user sessions');
        }
    }
}

export async function getMinistryCSessions(id: string) {
    try {
        await connectDB();
        const sessions = await CSession.find({ classId: id })
            .populate('classId')
            .populate('createdBy')
            .lean(); // Use lean() for plain JS objects

        return JSON.parse(JSON.stringify(sessions));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching class sessions:', error.message);
            throw new Error(`Error occurred while fetching class sessions: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('An unknown error occurred while fetching class sessions');
        }
    }
}

export async function getUserCSessionsWithoutEvent(id: string) {
    try {
        await connectDB();
        const sessions = await CSession.find({ createdBy: id })
            .populate('classId')
            .populate('createdBy')
            .lean(); // Use lean() for plain JS objects

        return JSON.parse(JSON.stringify(sessions));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching sessions:', error.message);
            throw new Error(`Error occurred while fetching sessions: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('An unknown error occurred while fetching sessions');
        }
    }
}

export async function getVendorCSessionRegistrations(createdBy:string){
    try {
        await connectDB();
        const members = await CSession.countDocuments({createdBy});
        return members;
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching members data');
    }
}



export async function getCSessionMetadata(sessionId: string, ministryId: string) {
    try {
        connectDB();
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        const [attendances, recentAttendances, registrations] = await Promise.all([
            CAttendance.countDocuments({ sessionId }), // Total attendances
            CAttendance.countDocuments({ sessionId, createdAt: { $gte: thirtyMinutesAgo } }), // Attendances in last 30 mins
            Ministry.findById(ministryId) // Total registrations
        ]);
        const members = registrations?.members?.length;
        const absent = members - attendances;

        return { members, attendances, recentAttendances, absent };
    } catch (error) {
        console.error('Error fetching session metadata:', error);
        throw new Error('Error occurred fetching session data');
    }
}


export async function deleteCSession(id: string) {
    try {
        await connectDB();
        const session = await CSession.findById(id);
        if(!session){
            throw new Error("Session does not exist");
        }

        // await Event.findByIdAndUpdate(session.eventId, {
        //     $inc:{sessions:-1}
        // }, {new:true})
        await CAttendance.deleteMany({sessionId:session._id});
        await CSession.findByIdAndDelete(session._id);

        return handleResponse('Session deleted succussfully', false);
    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse('An unknown error occurred while deleting sessions', true);
    }
}


// export async function updateCSessionStatuses() {
//     try {
//         await connectDB();

//         const now = new Date();

//         // Find all sessions and update their statuses based on current time
//         const sessions = await CSession.find();

//         for (const session of sessions) {
//             let newStatus: CSessionStatus;

//             if (session.startTime && session.endTime) {
//                 if (now < session.startTime) {
//                     newStatus = 'Upcoming';
//                 } else if (now >= session.startTime && now <= session.endTime) {
//                     newStatus = 'Ongoing';
//                 } else {
//                     newStatus = 'Completed';
//                 }

//                 // Update the session's status if it's different
//                 if (session.status !== newStatus) {
//                     session.status = newStatus;
//                     await session.save();
//                 }
//             }
//         }

//         console.log('CSession statuses updated successfully.');
//     } catch (error) {
//         console.error('Error updating session statuses:', error);
//         throw new Error('Error occurred while updating session statuses.');
//     }
// }


// setInterval(async () => {
//     try {
//         await updateCSessionStatuses();
//     } catch (error) {
//         console.error('Failed to update session statuses:', error);
//     }
// }, 60000); 