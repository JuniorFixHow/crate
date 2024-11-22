'use client'
import { RegColumns } from '@/Dummy/contants';
import { members } from '@/Dummy/Data';
import SearchBar from '@/features/SearchBar';
import { searchMember } from '@/functions/search';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react'

const RegistrationTable = () => {
    const [search, setSearch] = useState<string>('');
    const paginationModel = { page: 0, pageSize: 5 };
    // console.log(searchMember(search, members))
  return (
    <div className='xl:w-[67rem] gap-4 p-6 flex flex-col rounded shadow-xl bg-white dark:bg-black dark:border' >
        <div className="flex flex-row items-center justify-between">
            <span className='font-bold text-xl' >Registration</span>
            <SearchBar setSearch={setSearch} reversed />
        </div>

        <div className="flex md:w-full xl:w-2/3">
            <Paper className='' sx={{ height: 400, }}>
                <DataGrid
                    rows={searchMember(search, members)}
                    columns={RegColumns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    className='dark:bg-black dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    </div>
  )
}

export default RegistrationTable