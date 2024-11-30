'use client'
import AddButton from '@/components/features/AddButton';
import SearchBar from '@/components/features/SearchBar';
import SearchSelectEvents from '@/components/features/SearchSelectEvents';
import { LinearProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { GroupColumns } from './GroupColumns';
import {  SearchGroupWithoutEvent } from './fxn';
import { useFetchEvents } from '@/hooks/fetch/useEvent';
import { useFetchGroups } from '@/hooks/fetch/useGroups';
import { IGroup } from '@/lib/database/models/group.model';

type GroupTableProps = {
  eventId:string,
  setEventId:Dispatch<SetStateAction<string>>
}

const GroupTable = ({eventId, setEventId}:GroupTableProps) => {
    const [search, setSearch] = useState<string>('');
    const {events} = useFetchEvents();
    const {groups, loading} = useFetchGroups(eventId);
    // console.log('Groups here: ',groups)

    // console.log('EventID: ', eventId)

    useEffect(()=>{
      if(events.length>0){
        setEventId(events[0]._id)
      }
    },[events, setEventId])
    
    const paginationModel = { page: 0, pageSize: 10 };
    const router = useRouter()
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-black dark:border rounded' >
        <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
          <SearchSelectEvents setSelect={setEventId} isGeneric />
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <AddButton onClick={()=>router.push('/dashboard/groups/new')} smallText text='Add Group' className='rounded' />
            </div>
        </div> 
       
        <div className="flex w-full">
          {
            loading ?
            <LinearProgress className='w-full' />
            :
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={SearchGroupWithoutEvent(groups, search)}
                    getRowId={(row:IGroup)=>row._id}
                    columns={GroupColumns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
          }
        </div>

    </div>
  )
}

export default GroupTable