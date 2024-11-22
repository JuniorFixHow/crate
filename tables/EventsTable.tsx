'use client'
import { EventColumns } from '@/Dummy/contants'
import { EventsData } from '@/Dummy/Data'
import AddButton from '@/features/AddButton'
import SearchBar from '@/features/SearchBar'
import { searchEvent } from '@/functions/search'
import { Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const EventsTable = () => {
    const [search, setSearch] = useState<string>('')
    const paginationModel = { page: 0, pageSize: 10 };
    const router = useRouter();
  return (
    <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center flex-row justify-between w-full">
            <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
            <AddButton onClick={()=>router.push('events/new')} smallText noIcon  className='rounded-md' text='Create Event' />
        </div>

        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={searchEvent(search, EventsData)}
                    columns={EventColumns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    </div>
  )
}

export default EventsTable