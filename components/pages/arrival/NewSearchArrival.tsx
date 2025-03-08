'use client'
import { useEffect, useState } from 'react'


import LongSearchbar from '@/components/features/badges/LongSearchbar'
import BadgeSearchItem from '@/components/features/badges/BadgeSearchItem'
import { useFetchReadyRegistrations } from '@/hooks/fetch/useRegistration'
import { SearchReadyReg } from './fxn'
import { IMember } from '@/lib/database/models/member.model'
import { useFetchEvents } from '@/hooks/fetch/useEvent'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2'
import TipUser from '@/components/misc/TipUser'

const NewArrivalSearch = () => {
    const [search, setSearch] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const {events} = useFetchEvents();

    const {readyRegistrations} = useFetchReadyRegistrations(eventId);

    const searched = SearchReadyReg(readyRegistrations, search);

    useEffect(()=>{
        setEventId(events[0]?._id)
    },[events])

    const message = "Only members registered for the selected event with badges printed, rooms allocated and keys assigned will appear in this search"

  return (
    <div className="flex flex-col bg-white dark:bg-transparent dark:border p-4 rounded shadow gap-3">
        <SearchSelectEventsV2  setSelect={setEventId} />
        <div className='p-4 gap-4 flex-col shadow-xl flex bg-white dark:bg-[#0F1214] border' >
            <LongSearchbar className='w-full' setSearch={setSearch} placeholder='type here to search for a member'  />
            {
              searched.length === 0 &&
              <TipUser text={message} />
            }
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