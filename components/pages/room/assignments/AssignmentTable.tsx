'use client'
import AddButton from '@/components/features/AddButton'
import SearchBar from '@/components/features/SearchBar'
import React, { useState } from 'react'
import AssignmentFilter from './AssignmentFilter'
import { EventRegProps } from '@/types/Types'
import DeleteDialog from '@/components/DeleteDialog'
import { Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { SearchEventRegWithStatus } from './fxn'
import { EventRegistrations } from '@/components/Dummy/Data'
import { AssignmentColumns } from './AssignmentColumns'

const AssignmentTable = () => {
    const [status, setStatus] = useState<string>('All');
    const [search, setSearch] = useState<string>('');
    const [isGroup, setIsGroup] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentAssignment, setCurrentAssignment] = useState<EventRegProps|null>(null);

    const handleUnassign = (data:EventRegProps)=>{
        setCurrentAssignment(data);
        setDeleteMode(true);
    }

    const message = `You're about to unassign Member Name a room. Continue?`
    const message2 = `You're about to unassign Group Name a room. This will also affect the entire members in this group. Are you sure of what you're doing?`
    const paginationModel = { page: 0, pageSize: 10 };
    
  return (
    <div className='flex flex-col gap-4' >
        <div className="flex gap-4 items-center">
            <div onClick={()=>setIsGroup(false)}  className="flex flex-col cursor-pointer w-fit px-2">
                <span className={`${isGroup ? 'text-slate-500':'dark:tex-white'} text-[0.9rem]`} >Individuals</span>
                <div className={`w-full h-[3px] bg-blue-600 rounded-t ${isGroup ? 'hidden':'block'}`}/>
            </div>
            <div onClick={()=>setIsGroup(true)}  className="flex flex-col cursor-pointer w-fit px-2">
                <span className={`${!isGroup ? 'text-slate-500':'dark:tex-white'} text-[0.9rem]`} >Groups</span>
                <div className={`w-full h-[3px] bg-blue-600 rounded-t ${!isGroup ? 'hidden':'block'}`}/>
            </div>
        </div>

        <DeleteDialog value={deleteMode} setValue={setDeleteMode} onTap={()=>{}} title='Unassign room' message={currentAssignment?.regType === 'Individual' ? message:message2} />
        <div className="flex flex-col gap-5 bg-white dark:bg-black rounded border p-4">
            <div className="flex justify-between items-center">
                <AssignmentFilter setSelect={setStatus} />
                <div className="flex items-center gap-2">
                    <SearchBar reversed={false} setSearch={setSearch} />
                </div>
            </div>


            <div className="flex w-full">
              <Paper className='w-full' sx={{ height: 480, }}>
                  <DataGrid
                      rows={SearchEventRegWithStatus(EventRegistrations, search, status)}
                      columns={AssignmentColumns(handleUnassign,  isGroup)}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      // checkboxSelection
                      className='dark:bg-black dark:border dark:text-blue-800'
                      sx={{ border: 0 }}
                  />
              </Paper>
          </div>

        </div>
    </div>
  )
}

export default AssignmentTable