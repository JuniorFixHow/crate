'use client'
import { formatTimeRange, getActivityStatus, getPercentage } from '@/components/pages/session/fxn';
import { getSessionMetadata } from '@/lib/actions/session.action';
import { ISession } from '@/lib/database/models/session.model';
import React, { useEffect, useState } from 'react'
import { TbLivePhotoFilled } from "react-icons/tb";

type SessionContentTopProps = {
    currentSession:ISession,
    eventId:string
}

const SessionContentTop = ({currentSession, eventId}:SessionContentTopProps) => {
    const [registrations, setRegistrations] = useState<number>(0);
    const [present, setPresent] = useState<number>(0);
    const [absent, setAbsent] = useState<number>(0);
    const [recent, setRecent] = useState<number>(0);

    // console.log(registrations)

    useEffect(() => {
        const fetchMetaData = async () => {
            if (currentSession) {
                // console.log('Current Session:', currentSession);
                const event = eventId || (typeof currentSession.eventId === 'object' && currentSession.eventId._id?.toString());
                // console.log('Event ID:', event);
    
                if (event) {
                    try {
                        const { registrations, absent, attendances, recentAttendances } = await getSessionMetadata(currentSession._id, event);
                        // console.log('Fetched Metadata:', { registrations, attendances, absent });
    
                        setRegistrations(registrations);
                        setPresent(attendances);
                        setAbsent(absent);
                        setRecent(recentAttendances);
                    } catch (error) {
                        console.error('Error fetching metadata:', error);
                    }
                }
            }
        };
        fetchMetaData();
    }, [currentSession, eventId]);
    
    const live = currentSession?.from && currentSession?.to && getActivityStatus(currentSession.from, currentSession.to);

  return (
    <div className='flex flex-col rounded gap-2 bg-white border dark:bg-[#0F1214] px-1 pt-1 py-4' >
        <div className="flex flex-row items-center gap-4">
            <span className='font-semibold hidden md:block' >Attendance Overview</span>
            <TbLivePhotoFilled className={`${live === 'Upcoming'?'text-blue-700':live==='Ongoing'? 'text-green-700':'text-slate-400'}`} />
            <div className="flex flex-row items-center gap-2">
                <span className='font-medium text-[0.8rem]' >Time:</span>
                <span className='font-medium text-[0.8rem] text-blue-700' >{currentSession?.from && currentSession?.to && formatTimeRange(currentSession.from!, currentSession.to!)}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
                <span className='font-medium text-[0.8rem]' >Venue:</span>
                <span className='font-medium text-[0.8rem] text-blue-700' >{currentSession?.venue}</span>
            </div>
        </div>

        <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-col gap-1 pr-2 border-r-2">
                <span className='text-blue-700 font-medium' >{registrations}</span>
                <span className='text-slate-500 text-[0.9rem] font-medium' >Total Registrants</span>
            </div>

            <div className="flex gap-10 border-r-2 flex-row items-center pr-2">
                <div className="flex flex-col gap-1">
                    <span className='text-blue-700 font-medium' >{present}<span className='text-slate-500' >({getPercentage(present, registrations)})</span></span>
                    <span className='text-slate-500 text-[0.9rem] font-medium' >Present</span>
                </div>

                <div className="flex flex-col gap-1">
                    <span className='text-blue-700 font-medium' >{absent}<span className='text-slate-500' >({getPercentage(absent, registrations)})</span></span>
                    <span className='text-slate-500 text-[0.9rem] font-medium' >Absent</span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-blue-700 font-medium' >{recent}</span>
                <span className='text-slate-500 text-[0.9rem] font-medium' >Most Recent</span>
            </div>
        </div>
    </div>
  )
}

export default SessionContentTop