// 'use client'
import React, { Dispatch, SetStateAction } from 'react'
import Subtitle from '../Subtitle'
import SearchSelectEvents from '../SearchSelectEvents'
import { SessionProps } from '@/types/Types'
import '../customscroll.css';
import SelectSessionScanItem from './SelectSessionScanItem'
import { SessionsData } from '@/Dummy/Data'
import AddButton from '../AddButton'

type SelectSessionScanProps = {
    currentSession:SessionProps,
    setCurrentSession:Dispatch<SetStateAction<SessionProps|null>>,
    setStage:Dispatch<SetStateAction<number>>
}

const SelectSessionScan = ({currentSession, setCurrentSession, setStage}:SelectSessionScanProps) => {
    
  return (
    <div className='flex flex-col gap-6 bg-white border rounded dark:bg-black p-4' >
        <Subtitle text='Scan Badge' />
        <div className="flex flex-col md:flex-row items-start gap-6 md:justify-between">
            <div className="flex flex-col">
                <span className='font-medium' >Select Event</span>
                <SearchSelectEvents isGeneric />
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <span className='font-medium' >Select Session</span>
                    <div className="flex overflow-y-scroll scrollbar-custom flex-col h-[40vh] pr-4 gap-4">
                        {
                            SessionsData.map((item)=>(
                                <SelectSessionScanItem className={`${currentSession?.id === item.id && 'border-blue-700'}`} onClick={()=>setCurrentSession(item)} session={item} key={item.id} />
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
    </div>
  )
}

export default SelectSessionScan