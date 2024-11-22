'use client'
import AddButton from '@/features/AddButton'
import { LuScanLine } from 'react-icons/lu'
import SessionSide from './SessionSide'
import SessionDates from '@/features/sessions/SessionDates'
import SessionContent from './SessionContent'
import { useState } from 'react'
import { SessionProps } from '@/types/Types'
import { SessionsData } from '@/Dummy/Data'
import { searchSession } from '@/functions/search'
import { useRouter } from 'next/navigation'

const Sessions = () => {
  const date = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(date.toLocaleDateString())
  const [selectedTime, setSelectedTime] = useState<string>('All');
  const [hasClickedEllipses, setHasClickedEllipses] = useState<boolean>(false);
  
  const ses = searchSession(selectedTime, SessionsData)[0]
  const [currentSession, setCuurentSession] = useState<SessionProps>(ses);
  // const [search, setSearch] = useState<string>('');
  const router = useRouter();

  return (
    <div className='w-fit flex flex-col gap-5' >
      <div className="flex flex-row items-center gap-4 justify-end">
        <div onClick={()=>router.push('/dashboard/events/sessions/scan')}  className="flex flex-row gap-3 bg-white items-center px-8 py-[0.2rem] hover:bg-slate-100 cursor-pointer rounded border dark:bg-black dark:hover:border-blue-700">
            <LuScanLine/>
            <span className='text-[0.9rem] font-semibold' >Scan</span>
        </div>
        <AddButton onClick={()=>router.push('/dashboard/events/sessions/new')} text='Create Session' noIcon smallText className='rounded' />
      </div>
      <div className="flex flex-row gap-4">
        <SessionSide selectedTime={selectedTime} setSelectedTime={setSelectedTime}  value={hasClickedEllipses} setValue={setHasClickedEllipses} setCurrentSession={setCuurentSession} currentSession={currentSession} />
        <div className="flex flex-col gap-2">
          <SessionDates text={selectedDate} setText={setSelectedDate} />
          <SessionContent/>
        </div>
      </div>
    </div>
  )
}

export default Sessions
