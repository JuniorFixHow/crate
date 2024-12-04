'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Subtitle from '../Subtitle'
import SearchSelectEvents from '../SearchSelectEvents'
import '../customscroll.css';
import SelectSessionScanItem from './SelectSessionScanItem'
import AddButton from '../AddButton'
import { useFetchSessions } from '@/hooks/fetch/useSession'
import { searchSessionWithEvent } from '@/components/pages/session/fxn'
import { ISession } from '@/lib/database/models/session.model'
import { LinearProgress } from '@mui/material';

type SelectSessionScanProps = {
    currentSession:ISession,
    setCurrentSession:Dispatch<SetStateAction<ISession|null>>,
    setStage:Dispatch<SetStateAction<number>>
}

const SelectSessionScan = ({currentSession, setCurrentSession, setStage}:SelectSessionScanProps) => {
    const [eventId, setEventId] = useState<string>('');
    const {sessions, loading} = useFetchSessions();
    
  return (
    <div className='flex flex-col gap-6 bg-white border rounded dark:bg-black p-4' >
        <Subtitle text='Scan Badge' />
        {
            loading ? 
            <LinearProgress className='w-full' />
            :
            <div className="flex flex-col md:flex-row items-start gap-6 md:justify-between">
                <div className="flex flex-col">
                    <span className='font-medium' >Select Event</span>
                    <SearchSelectEvents setSelect={setEventId} isGeneric />
                </div>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <span className='font-medium' >Select Session</span>
                        <div className="flex overflow-y-scroll scrollbar-custom flex-col h-[40vh] pr-4 gap-4">
                            {
                                sessions.length &&
                                searchSessionWithEvent(sessions, eventId).map((item)=>(
                                    <SelectSessionScanItem className={`${currentSession?._id === item._id && 'border-blue-700'}`} onClick={()=>setCurrentSession(item)} session={item} key={item._id} />
                                ))
                            }
                        </div>
                        {
                            currentSession &&
                            <AddButton onClick={()=>setStage(2)} text='Continue' className='px-4 py-1 w-fit rounded' noIcon smallText />
                        }
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default SelectSessionScan