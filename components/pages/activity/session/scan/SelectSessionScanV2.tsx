'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import '@/components/features/customscroll.css';

import { LinearProgress } from '@mui/material';
import Subtitle from '@/components/features/Subtitle';
import SelectSessionScanItemV2 from './SelectSessionScanItemV2';
import AddButton from '@/components/features/AddButton';
import SearchSelectClassministries from '@/components/features/SearchSelectClassministries';
import SearchSelectActivity from '@/components/features/SearchSelectActivity';
import SearchSelectClassV2 from '@/components/features/SearchSelectClassV2';
// import { searchSessionWithClass } from './fxn';
import { useFetchClassSession } from '@/hooks/fetch/useClasssession';
import { IClasssession } from '@/lib/database/models/classsession.model';

type SelectSessionScanV2Props = {
    currentSession:IClasssession,
    setCurrentSession:Dispatch<SetStateAction<IClasssession|null>>,
    setStage:Dispatch<SetStateAction<number>>
}

const SelectSessionScanV2 = ({currentSession, setCurrentSession, setStage}:SelectSessionScanV2Props) => {
    
    const [classMinistryId, setClassMinistryId] = useState<string>('');
    const [activityId, setActivityId] = useState<string>('');
    const [ministryId, setMinistryId] = useState<string>('');
    const {sessions, isPending} = useFetchClassSession(ministryId);
    
  return (
    <div className='flex flex-col gap-6 bg-white border rounded dark:bg-[#0F1214] p-4' >
        <Subtitle text='Scan Badge' />
        {
            !! ministryId && isPending ? 
            <LinearProgress className='w-full' />
            :
            <div className="flex flex-col md:flex-row items-start gap-6 md:justify-between">
                <div className="flex flex-col gap-4">
                <SearchSelectClassministries width={250} setSelect={setClassMinistryId} />
                {
                    classMinistryId && <SearchSelectActivity width={250} minId={classMinistryId} setSelect={setActivityId} />
                }
                {
                    activityId && <SearchSelectClassV2 width={250} activityId={activityId} setSelect={setMinistryId} />
                }
                </div>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <span className='font-medium' >{sessions?.length ? 'Select Session':'No Sessions for this class'}</span>
                        <div className="flex overflow-y-scroll scrollbar-custom flex-col h-[40vh] pr-4 gap-4">
                            {
                                sessions?.length > 0 &&
                                sessions?.map((item)=>(
                                    <SelectSessionScanItemV2 className={`${currentSession?._id === item._id && 'border-blue-700'}`} onClick={()=>setCurrentSession(item)} session={item} key={item?._id} />
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

export default SelectSessionScanV2