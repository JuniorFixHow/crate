'use client'
import { formatTimeRange, getActivityStatus, getPercentage } from '@/components/pages/session/fxn';
import { getCSessionMetadata } from '@/lib/actions/classsession.action';
import { IClasssession } from '@/lib/database/models/classsession.model';
import { IMinistry } from '@/lib/database/models/ministry.model';
import React, { useEffect, useState } from 'react'
import { TbLivePhotoFilled } from "react-icons/tb";

type SessionContentTopV2Props = {
    currentSession:IClasssession,
    ministryId:string
}

type statProps = {
    reg:number,
    absent:number,
    recent:number,
    present:number
}

const SessionContentTopV2 = ({currentSession, ministryId}:SessionContentTopV2Props) => {
    const [stats, setStats] = useState<Partial<statProps>>({reg:0, absent:0, recent:0, present:0})

    const min = currentSession?.classId as IMinistry
    // console.log(registrations)

    useEffect(() => {
        const fetchMetaData = async () => {
            const minId = ministryId ?? min?._id;
            if (minId) {
                try {
                    const { members, absent, attendances, recentAttendances } = await getCSessionMetadata(currentSession?._id, minId);
                    // console.log('Fetched Metadata:', { registrations, attendances, absent });
                    setStats({
                        reg:members, present:attendances,absent, recent:recentAttendances
                    })
                    
                } catch (error) {
                    console.error('Error fetching metadata:', error);
                }
            }
           
        };
        fetchMetaData();
    }, [currentSession, min?._id, ministryId]);
    
    const live = currentSession?.from && currentSession?.to && getActivityStatus(currentSession.from, currentSession.to);

  return (
    <div className='flex flex-col rounded gap-2 bg-white border dark:bg-[#0F1214] px-1 pt-1 py-4' >
        <div className="flex flex-row items-center gap-4">
            <span className='font-semibold' >Attendance Overview</span>
            <TbLivePhotoFilled className={`${live === 'Upcoming'?'text-blue-700':live==='Ongoing'? 'text-green-700':'text-slate-400'}`} />
            <div className="flex flex-row items-center gap-2">
                <span className='font-medium text-[0.8rem]' >Time:</span>
                <span className='font-medium text-[0.8rem] text-blue-700' >{currentSession?.from && currentSession?.to && formatTimeRange(currentSession.from!, currentSession.to!)}</span>
            </div>
            {
                currentSession?.venue &&
                <div className="flex flex-row items-center gap-2">
                    <span className='font-medium text-[0.8rem]' >Venue:</span>
                    <span className='font-medium text-[0.8rem] text-blue-700' >{currentSession?.venue}</span>
                </div>
            }
        </div>

        <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-col gap-1 pr-2 border-r-2">
                <span className='text-blue-700 font-medium' >{stats?.reg}</span>
                <span className='text-slate-500 text-[0.9rem] font-medium' >Class Members</span>
            </div>

            <div className="flex gap-10 border-r-2 flex-row items-center pr-2">
                <div className="flex flex-col gap-1">
                    <span className='text-blue-700 font-medium' >{stats?.present}<span className='text-slate-500' >({getPercentage(stats?.present as number, stats?.reg as number)})</span></span>
                    <span className='text-slate-500 text-[0.9rem] font-medium' >Present</span>
                </div>

                <div className="flex flex-col gap-1">
                    <span className='text-blue-700 font-medium' >{stats?.absent}<span className='text-slate-500' >({getPercentage(stats?.absent as number, stats?.reg as number)})</span></span>
                    <span className='text-slate-500 text-[0.9rem] font-medium' >Absent</span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-blue-700 font-medium' >{stats?.recent}</span>
                <span className='text-slate-500 text-[0.9rem] font-medium' >Most Recent</span>
            </div>
        </div>
    </div>
  )
}

export default SessionContentTopV2