'use client'
import { attendanceRoles, canPerformAction, canPerformEvent, eventOrganizerRoles } from '@/components/auth/permission/permission';
import OpenScanner from '@/components/features/sessions/OpenScanner';
import ScanSuccess from '@/components/features/sessions/ScanSuccess';
import SelectSessionScan from '@/components/features/sessions/SelectSessionScan'
import { useAuth } from '@/hooks/useAuth';
import { ISession } from '@/lib/database/models/session.model';
import { ErrorProps } from '@/types/Types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Scanner = () => {
    const [currentSession, setCurrentSession] = useState<ISession|null>(null);
    const [result, setResult] = useState<ErrorProps>(null);
    const [laoding, setLoading] = useState<boolean>(false);
    const [stage, setStage] = useState<number>(1);
    const {user} = useAuth();
    const router = useRouter();

    const creator = canPerformAction(user!, 'creator', {attendanceRoles});
    const orgCreator = canPerformEvent(user!, 'creator', {eventOrganizerRoles});

    useEffect(()=>{
        if(user && (!creator && !orgCreator)){
            router.replace('/dashboard/forbidden?p=Attendance Creator');
        }
    },[user, creator, orgCreator, router])

    if(!creator && !orgCreator) return;
  return (
    <div className='w-full' >
        {
            stage === 1 &&
            <SelectSessionScan setStage={setStage} currentSession={currentSession!} setCurrentSession={setCurrentSession} />
        }
        {
            stage === 2 &&
            <OpenScanner setLoading={setLoading} setResult={setResult} currentSession={currentSession!} setStage={setStage} />
        }
        {
            stage === 3 &&
            <ScanSuccess loading={laoding} result={result} setStage={setStage} />
        }
    </div>
  )
}

export default Scanner