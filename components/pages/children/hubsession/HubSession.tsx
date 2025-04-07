'use client'
import AddButton from '@/components/features/AddButton'
import { LuScanLine } from 'react-icons/lu'
// import SessionDates from '@/components/features/sessions/SessionDates'
import { useEffect, useState } from 'react'

import { searchSession } from '@/functions/search'
import { useRouter } from 'next/navigation'
import { useFetchSessionsWithEventForChildren } from '@/hooks/fetch/useSession'
import { ISession } from '@/lib/database/models/session.model'
import { useAuth } from '@/hooks/useAuth'
import { attendanceRoles, canPerformAction, canPerformEvent, eventOrganizerRoles, sessionRoles } from '@/components/auth/permission/permission'
import { IEvent } from '@/lib/database/models/event.model'
import Link from 'next/link'
import SessionSide from '../../session/SessionSide'
import SessionContent from '../../session/SessionContent'
// import { LinearProgress } from '@mui/material'

const HubSessions = () => {
  // const [selectedDate, setSelectedDate] = useState<string>(date.toLocaleDateString())
  const [selectedTime, setSelectedTime] = useState<string>('All');
  const [eventId, setEventId] = useState<string>('');
  // const [hasClickedEllipses, setHasClickedEllipses] = useState<boolean>(false);
  const {sessions, loading, refetch} = useFetchSessionsWithEventForChildren(eventId);
  const {user} = useAuth();
  
  const router = useRouter();
  const [currentSession, setCuurentSession] = useState<ISession|null>(null);
  const [currentEvent, setCuurentEvent] = useState<IEvent|null>(null);
  // const [search, setSearch] = useState<string>('');

  const attCreator = canPerformAction(user!, 'creator', {attendanceRoles});
  const sessionCreator = canPerformAction(user!, 'creator', {sessionRoles});
  const sessionReader = canPerformAction(user!, 'reader', {sessionRoles});
  const attReader = canPerformAction(user!, 'reader', {attendanceRoles});
  const orgCreator = canPerformEvent(user!, 'creator', {eventOrganizerRoles});
  const orgReader = canPerformEvent(user!, 'reader', {eventOrganizerRoles});

  const canCreateSession = (currentEvent?.forAll && orgCreator) || (!currentEvent?.forAll && sessionCreator);
  const canCreateAtt = (currentEvent?.forAll && orgCreator) || (!currentEvent?.forAll && attCreator);

  useEffect(()=>{
    if(user && (!attReader && !sessionReader && !orgReader)){
      router.replace('/dashboard/forbidden?p=Attendance Reader');
    }
  },[user, sessionReader, attReader, orgReader, router])

  useEffect(()=>{
    if(sessions.length){
      setCuurentSession(searchSession(selectedTime, eventId, sessions)[0])
    }
  },[eventId, selectedTime, sessions])

  
  if(!attReader && !sessionReader && !orgReader && !orgCreator) return;


  return (
    <div className=' flex flex-col gap-5' >
      <div className="flex flex-row items-center gap-4 justify-end">
        {
          canCreateAtt &&
          <Link href={{pathname:'/dashboard/events/sessions/scan', query:{type:'Child'}}}  className="flex flex-row gap-3 bg-white items-center px-8 py-[0.2rem] hover:bg-slate-100 cursor-pointer rounded border dark:bg-[#0F1214] dark:hover:border-blue-700">
              <LuScanLine/>
              <span className='text-[0.9rem] font-semibold' >Scan</span>
          </Link>
        }
        {
          canCreateSession &&
          <Link href={{pathname:'/dashboard/events/sessions/new', query:{type:'Child'}}} >
            <AddButton text='Create Session' noIcon smallText className='rounded' />
          </Link>
        }
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <SessionSide width={180} setCurrentEvent={setCuurentEvent} refetch={refetch} eventId={eventId} setEventId={setEventId} sessions={sessions} selectedTime={selectedTime} setSelectedTime={setSelectedTime}   setCurrentSession={setCuurentSession} currentSession={currentSession!} />
        <div className="flex flex-col gap-2 grow">
          {/* <SessionDates text={selectedDate} setText={setSelectedDate} /> */}
          <SessionContent currentEvent={currentEvent} loading={loading} eventId={eventId} currentSession={currentSession!} />
        </div>
      </div>
    </div>
  )
}

export default HubSessions
