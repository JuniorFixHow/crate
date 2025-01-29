'use client'
import React, { useState } from 'react'
import Subtitle from '@/components/features/Subtitle';
import { LinearProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFetchMembersInAChurch } from '@/hooks/fetch/useMember';
import { IMember } from '@/lib/database/models/member.model';
import { searchMember } from '@/functions/search';
import { NewActivityColumns } from './NewActivityCoulmns';
import SearchBar from '@/components/features/SearchBar';
import NewActivityDownV3 from './NewActivityDownV3';

const NewActivityTable = () => {

    const [search, setSearch] = useState<string>('');
    const {loading, members} = useFetchMembersInAChurch()

    const [membersId, setMemberIds] =useState<string[]>([]); 

    const handleCheckClick = (id:string)=>{
        setMemberIds((prev)=>{
            return prev.includes(id) ?
            prev.filter((item)=>item !== id)
            :
            [...prev, id]
        })
    }

    const paginationModel = { page: 0, pageSize: 10 };
    return (
      <div className='w-full flex flex-col' >
        <div className="w-full flex justify-between p-4 rounded-t border border-slate-300 bg-white dark:bg-[#0F1214]">
          <Subtitle text='Select Members' />
          <div className="flex-center px-3 py-2 rounded border">
              <span className='text-[0.9rem]' >Members selected: <span className='font-semibold' >{membersId.length}</span></span>
          </div>
        </div>
        <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-[#0F1214] p-4">

        
          <div className="flex flex-col gap-2">
            <div className="flex justify-end">
                <SearchBar setSearch={setSearch} reversed={false} />
            </div>

              <div className="flex w-full">
                {
                  loading ? 
                  <LinearProgress className='w-full' />
                  :
                  <Paper className='w-full' sx={{ height: 480, }}>
                      <DataGrid
                        getRowId={(row:IMember)=>row._id}
                        rows={searchMember(search, members)}
                        columns={NewActivityColumns(membersId, handleCheckClick)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                      />
                  </Paper>
                }
              </div>
           
              <NewActivityDownV3 members={membersId}/>
           
          </div>
        </div>
      </div>
    )
}

export default NewActivityTable