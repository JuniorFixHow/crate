'use client'
import { EventColumns } from '@/components/Dummy/contants'
import AddButton from '@/components/features/AddButton'

import { useFetchEvents } from '@/hooks/fetch/useEvent'
import { IEvent } from '@/lib/database/models/event.model'
import {  Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { canPerformAction, eventRoles } from '../auth/permission/permission'
import { useAuth } from '@/hooks/useAuth'

const EventsTable = () => {
    // const [search, setSearch] = useState<string>('')
    const paginationModel = { page: 0, pageSize: 10 };
    const router = useRouter();
    const {events, loading} = useFetchEvents();

    const {user} = useAuth();

    const reader = canPerformAction(user!, 'reader', {eventRoles});
    const creator = canPerformAction(user!, 'creator', {eventRoles});
    const updater = canPerformAction(user!, 'updater', {eventRoles});


    useEffect(()=>{
        if(user && !reader){
           router.replace('/dashboard/forbidden?p=Event Reader')
        }
    },[reader, user, router])

    if(!reader) return
  return (
    <div className="table-main2">
        <div className="flex items-center flex-row justify-end w-full">
            {
                creator && 
                <AddButton onClick={()=>router.push('events/new')} smallText noIcon  className='rounded-md' text='Create Event' />
            }
        </div>

        <div className="flex w-full bg-white dark:bg-transparent dark:border p-4 rounded">
            
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    getRowId={(row:IEvent)=>row._id}
                    rows={events}
                    columns={EventColumns(updater)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                    loading={loading}
                    slots={{toolbar:GridToolbar}}
                    slotProps={{
                        toolbar:{
                            showQuickFilter:true,
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true
                            }
                        }
                    }}
                />
            </Paper>
        </div>
    </div>
  )
}

export default EventsTable