'use server'
import Attendance from "../database/models/attendance.model";
import Event from "../database/models/event.model";
import Registration from "../database/models/registration.model";
import Session, { ISession } from "../database/models/session.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";

export async function createSession(session:Partial<ISession>){
    try {
        await connectDB();
        const newSession = await Session.create(session);
        await Event.findByIdAndUpdate(newSession.eventId, {
            $inc:{sessions:1}
        }, {new:true});
        return JSON.parse(JSON.stringify(newSession));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating session:', error.message);
            throw new Error(`Error occurred during session creation: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during session creation');
        }
    }
}

export async function updateSession(id: string, session: Partial<ISession>) {
    try {
        await connectDB();

        const sess = await Session.findByIdAndUpdate(id, session, { new: true });

        if (!sess) {
            throw new Error('Session not found');
        }

        const sessions = await Session.countDocuments({ eventId: sess.eventId });

        await Event.findByIdAndUpdate(sess.eventId, { sessions }, { new: true });

        return JSON.parse(JSON.stringify(sess));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating session:', error.message);
            throw new Error(`Error occurred during session update: ${error.message}`);
        } else {
            console.error('Unknown error:', error);
            throw new Error('Error occurred during session update');
        }
    }
}


export async function getSession(id:string){
    try {
        await connectDB();
        const sess = await Session.findById(id).populate('eventId').populate('createdBy').lean();
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


export async function getSessions(type:string){
    try {
        await connectDB();
        const sess = await Session.find({type}).populate('eventId').populate('createdBy').lean();
        
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

export async function getPublicSessions(type:string){
    try {
        await connectDB();
        const events = await Event.find({forAll:true, type}).select('_id');
        const eventIds = events.map((item)=>item?._id);
        const sess = await Session.find({
            eventId: {$in: eventIds},
            type:'Adult'
        }).populate('eventId').populate('createdBy').lean();
        
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


export async function getChurchSessions(type:string, churchId:string){
    try {
        await connectDB();
        const events = await Event.find({
            forAll:false, churchId, type
        }).select('_id');
        const eventIds = events.map((item)=>item?._id);
        const sess = await Session.find({
            eventId: {$in: eventIds},
            type:'Adult'
        }).populate('eventId').populate('createdBy').lean();
        
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



export async function getChurchSessionsV2(churchId:string){
    try {
        await connectDB();
        const events = await Event.find({
            $or:[
                {forAll:true},
                {churchId}
            ]
        }).select('_id');
        const eventIds = events.map((item)=>item?._id);
        const sess = await Session.find({
            eventId: {$in: eventIds},
            type:'Adult'
        }).populate('eventId').populate('createdBy').lean();
        
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



export async function getUserSessions(id: string, userId: string) {
    try {
        await connectDB();
        const sessions = await Session.find({ eventId: id, createdBy: userId })
            .populate('eventId')
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

export async function getEventSessions(id: string) {
    try {
        await connectDB();
        const sessions = await Session.find({ eventId: id, type:'Adult' })
            .populate('eventId')
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

export async function getEventSessionsForChildren(id: string) {
    try {
        await connectDB();
        const sessions = await Session.find({ eventId: id, type:'Child' })
            .populate('eventId')
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

export async function getUserSessionsWithoutEvent(id: string) {
    try {
        await connectDB();
        const sessions = await Session.find({ createdBy: id })
            .populate('eventId')
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

export async function getVendorSessionRegistrations(createdBy:string){
    try {
        await connectDB();
        const members = await Session.countDocuments({createdBy});
        return members;
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while fetching members data');
    }
}



export async function getSessionMetadata(sessionId: string, eventId: string) {
    try {
        connectDB();
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        const [attendances, recentAttendances, registrations] = await Promise.all([
            Attendance.countDocuments({ sessionId }), // Total attendances
            Attendance.countDocuments({ sessionId, createdAt: { $gte: thirtyMinutesAgo } }), // Attendances in last 30 mins
            Registration.countDocuments({ eventId }) // Total registrations
        ]);

        const absent = registrations - attendances;

        return { registrations, attendances, recentAttendances, absent };
    } catch (error) {
        console.error('Error fetching session metadata:', error);
        throw new Error('Error occurred fetching session data');
    }
}


export async function deleteSession(id: string) {
    try {
        await connectDB();
        const session = await Session.findById(id);
        if(!session){
            throw new Error("Session does not exist");
        }

        await Event.findByIdAndUpdate(session.eventId, {
            $inc:{sessions:-1}
        }, {new:true})
        await Attendance.deleteMany({sessionId:session._id});
        await Session.findByIdAndDelete(session._id);

        return handleResponse('Session deleted succussfully', false, {}, 201);
    } catch (error) {
        console.error('Unknown error:', error);
        return handleResponse('Error occurred while deleting sessions', true, {}, 500);
    }
}


// export async function updateSessionStatuses() {
//     try {
//         await connectDB();

//         const now = new Date();

//         // Find all sessions and update their statuses based on current time
//         const sessions = await Session.find();

//         for (const session of sessions) {
//             let newStatus: SessionStatus;

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

//         console.log('Session statuses updated successfully.');
//     } catch (error) {
//         console.error('Error updating session statuses:', error);
//         throw new Error('Error occurred while updating session statuses.');
//     }
// }


// setInterval(async () => {
//     try {
//         await updateSessionStatuses();
//     } catch (error) {
//         console.error('Failed to update session statuses:', error);
//     }
// }, 60000); 