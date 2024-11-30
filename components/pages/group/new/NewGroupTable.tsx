'use client'
import SearchBar from '@/components/features/SearchBar'
import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import Subtitle from '@/components/features/Subtitle'
import { LinearProgress, Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { NewGroupColumns } from './NewGroupColumns'
import NewGroupDown from './NewGroupDown'
import {  useFetchRegistrationsWithEvents } from '@/hooks/fetch/useRegistration'
import { getNextGroupNumber } from '@/lib/actions/misc'
import { IRegistration } from '@/lib/database/models/registration.model'
import { SearchMemberForNewGroup } from './fxn'
import { useFetchEvents } from '@/hooks/fetch/useEvent'

const NewGroupTable = () => {
  const [eventId, setEventId] = useState<string>('');
  const [membersId, setMembersId] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [number, setNumber] = useState<number>(0);

  const {eventRegistrations, loading} = useFetchRegistrationsWithEvents(eventId);
  const {events} = useFetchEvents();

  const handleCheckClick = (id:string)=>{
    setMembersId((prev)=>(
      prev.includes(id) ?
      prev.filter((item)=>item !== id)
      :
      [...prev, id]
    ))
  }

  useEffect(()=>{
    const fetchNextNumber = async()=>{
      try {
        const {nextGroupNumber} = await getNextGroupNumber();
        setNumber(nextGroupNumber);
      } catch (error) {
        console.log(error)
      }
    }
    fetchNextNumber();
  },[])

  useEffect(()=>{
    if(events.length>0){
      setEventId(events[0]._id);
    }
  },[events])

  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className='w-full flex flex-col' >
      <div className="w-full p-4 rounded-t border border-slate-300 bg-white dark:bg-black">
        <Subtitle text='Create a group' />
      </div>
      <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-black p-4">
        <div className="flex items-center justify-between">
          <span className='text-[0.9rem]' >Group number: <span className='font-semibold' >{number}</span></span>
          <div className="flex-center px-3 py-2 rounded border">
            <span className='text-[0.9rem]' >Members selected: <span className='font-semibold' >{membersId.length}</span></span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <SearchSelectEvents setSelect={setEventId} isGeneric/>
            <SearchBar setSearch={setSearch} reversed={false} />
          </div>

          <div className="flex w-full">
            {
              loading ? 
              <LinearProgress className='w-full' />
              :
              <Paper className='w-full' sx={{ height: 480, }}>
                  <DataGrid
                    getRowId={(row:IRegistration)=>row._id}
                    rows={SearchMemberForNewGroup(eventRegistrations, search)}
                    columns={NewGroupColumns(membersId, handleCheckClick)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                  />
              </Paper>
            }
          </div>

          {
            membersId.length > 0 &&
            <NewGroupDown eventId={eventId} members={membersId} />
          }
        </div>
      </div>
    </div>
  )
}

export default NewGroupTable