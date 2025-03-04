'use client'
import AddButton from '@/components/features/AddButton'
import { LuScanLine } from 'react-icons/lu'
import SessionSide from './SessionSide'
// import SessionDates from '@/components/features/sessions/SessionDates'
import SessionContent from './SessionContent'
import { useEffect, useState } from 'react'

import { searchSession } from '@/functions/search'
import { useRouter } from 'next/navigation'
import {  useFetchSessionsWithEvent } from '@/hooks/fetch/useSession'
import { ISession } from '@/lib/database/models/session.model'
// import { LinearProgress } from '@mui/material'

const Sessions = () => {
  // const [selectedDate, setSelectedDate] = useState<string>(date.toLocaleDateString())
  const [selectedTime, setSelectedTime] = useState<string>('All');
  const [eventId, setEventId] = useState<string>('');
  // const [hasClickedEllipses, setHasClickedEllipses] = useState<boolean>(false);
  const {sessions, loading, refetch} = useFetchSessionsWithEvent(eventId);
  
  // const ses = searchSession(selectedTime, SessionsData)[0]
  const [currentSession, setCuurentSession] = useState<ISession|null>(null);
  // const [search, setSearch] = useState<string>('');
  useEffect(()=>{
    if(sessions.length){
      setCuurentSession(searchSession(selectedTime, eventId, sessions)[0])
    }
  },[eventId, selectedTime, sessions])
  const router = useRouter();

  // if(loading) return <div className='w-full' ><LinearProgress   className={`${loading ? 'flex-center':'hidden'}`}   /></div> 



  return (
    <div className=' flex flex-col gap-5' >
      <div className="flex flex-row items-center gap-4 justify-end">
        <div onClick={()=>router.push('/dashboard/events/sessions/scan')}  className="flex flex-row gap-3 bg-white items-center px-8 py-[0.2rem] hover:bg-slate-100 cursor-pointer rounded border dark:bg-[#0F1214] dark:hover:border-blue-700">
            <LuScanLine/>
            <span className='text-[0.9rem] font-semibold' >Scan</span>
        </div>
        <AddButton onClick={()=>router.push('/dashboard/events/sessions/new')} text='Create Session' noIcon smallText className='rounded' />
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <SessionSide refetch={refetch} eventId={eventId} setEventId={setEventId} sessions={sessions} selectedTime={selectedTime} setSelectedTime={setSelectedTime}   setCurrentSession={setCuurentSession} currentSession={currentSession!} />
        <div className="flex flex-col gap-2 grow">
          {/* <SessionDates text={selectedDate} setText={setSelectedDate} /> */}
          <SessionContent loading={loading} eventId={eventId} currentSession={currentSession!} />
        </div>
      </div>
    </div>
  )
}

export default Sessions
