'use client'
import { useEffect, useState } from 'react'


import LongSearchbar from '@/components/features/badges/LongSearchbar'
import BadgeSearchItem from '@/components/features/badges/BadgeSearchItem'
import { useFetchReadyRegistrations } from '@/hooks/fetch/useRegistration'
import { SearchReadyReg } from './fxn'
import { IMember } from '@/lib/database/models/member.model'
import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import { useFetchEvents } from '@/hooks/fetch/useEvent'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'

const NewArrivalSearch = () => {
    const [search, setSearch] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const {events} = useFetchEvents();

    const {readyRegistrations} = useFetchReadyRegistrations(eventId);

    useEffect(()=>{
        setEventId(events[0]?._id)
    },[events])

  return (
    <div className="flex flex-col bg-white dark:bg-transparent dark:border p-4 rounded shadow gap-3">
        <SearchSelectEvents className='w-fit' isGeneric setSelect={setEventId} />
        <div className='p-4 shadow-xl flex bg-white dark:bg-[#0F1214] border' >
            <LongSearchbar className='w-full' setSearch={setSearch} placeholder='type here to search for a member'  />
        </div>
        {
            response?.message &&
            <Alert severity={response.error?'error':'success'} >{response.message}</Alert>
        }
        <div className='p-4 shadow-xl flex-col gap-6 flex bg-white dark:bg-[#0F1214] border border-t-0' >
          {
            SearchReadyReg(readyRegistrations, search).map((item)=>{
                const member = item.memberId as unknown as IMember;
                return(
                    <BadgeSearchItem setResponse={setResponse} isCheckItem currentRegistration={item} key={member._id}    member={member} />
                )
            })
          }
        </div>
    </div>
  )
}

export default NewArrivalSearch