'use client'
import { EventColumns } from '@/components/Dummy/contants'
import AddButton from '@/components/features/AddButton'
import SearchBar from '@/components/features/SearchBar'
import { searchEvent } from '@/functions/search'
import { useFetchEvents } from '@/hooks/fetch/useEvent'
import { IEvent } from '@/lib/database/models/event.model'
import { LinearProgress, Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const EventsTable = () => {
    const [search, setSearch] = useState<string>('')
    const paginationModel = { page: 0, pageSize: 10 };
    const router = useRouter();
    const {events, loading} = useFetchEvents();


  return (
    <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center flex-row justify-between w-full">
            <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
            <AddButton onClick={()=>router.push('events/new')} smallText noIcon  className='rounded-md' text='Create Event' />
        </div>

        <div className="flex w-full bg-white dark:bg-transparent dark:border p-4 rounded">
            {
                loading ?
                <LinearProgress className='w-full' />
                :
                <Paper className='w-full' sx={{ height: 480, }}>
                    <DataGrid
                        getRowId={(row:IEvent)=>row._id}
                        rows={searchEvent(search, events)}
                        columns={EventColumns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                    />
                </Paper>
            }
        </div>
    </div>
  )
}

export default EventsTable