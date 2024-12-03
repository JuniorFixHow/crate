'use client'
import { RegColumns } from '@/components/Dummy/contants';
import SearchBar from '@/components/features/SearchBar';
import { searchMember } from '@/functions/search';
import { useFetchMembers } from '@/hooks/fetch/useMember';
import { IMember } from '@/lib/database/models/member.model';
import { LinearProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react'

const RegistrationTable = () => {
    const [search, setSearch] = useState<string>('');
    const paginationModel = { page: 0, pageSize: 5 };
    // console.log(searchMember(search, members))
    const {members, loading} = useFetchMembers();
  return (
    <div className=' gap-4 p-6 flex flex-col rounded shadow-xl bg-white dark:bg-black dark:border' >
        <div className="flex flex-row items-center justify-between">
            <span className='font-bold text-xl' >Registration</span>
            <SearchBar setSearch={setSearch} reversed />
        </div>

        <div className="flex w-full">
            {
                loading ? 
                <LinearProgress className='w-full' />
                :
                <Paper className='w-full' sx={{ height: 400, }}>
                    <DataGrid
                        getRowId={(row:IMember)=>row._id}
                        rows={searchMember(search, members)}
                        columns={RegColumns}
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

export default RegistrationTable