'use client'
import { MemberColumns } from '@/Dummy/contants';
import { members } from '@/Dummy/Data';
import SearchBar from '@/features/SearchBar';
import { searchMember } from '@/functions/search';
import { MemberProps } from '@/types/Types';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const MembersTable = () => {
    const [search, setSearch] = useState<string>('');
    const [membersData, setMembersData] = useState<MemberProps[]>([]);
    const paginationModel = { page: 0, pageSize: 5 };
    // console.log(searchMember(search, members))
    const searchParams = useSearchParams();

    // I may do this in a hook
    useEffect(()=>{
        const data = searchParams?.get('registeredBy');
        if(data){
            setMembersData(members.filter((member)=>member.registeredBy === data))
        }else{
            setMembersData(members);
        }

    },[searchParams])

  return (
    <div className='xl:w-[67rem] gap-4 p-6 flex flex-col rounded shadow-xl bg-white dark:bg-black dark:border' >
        <div className="flex flex-row items-center justify-between">
            <span className='font-bold text-xl' >Members</span>
            <SearchBar setSearch={setSearch} reversed />
        </div>

        <div className="flex lg:w-full w-2/3 relative">
            <Paper className='' sx={{ height: 400, width:'100%' }}>
                <DataGrid
                    rows={searchMember(search, membersData)}
                    columns={MemberColumns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border-slate-200 dark:border dark:text-[#3C60CA]'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    </div>
  )
}

export default MembersTable