'use client'
import React, { useEffect, useState } from 'react'
import Subtitle from '@/components/features/Subtitle';
import {  Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useFetchMembersInAChurch } from '@/hooks/fetch/useMember';
import { IMember } from '@/lib/database/models/member.model';
// import { searchMember } from '@/functions/search';
import { NewActivityColumns } from './NewActivityCoulmns';
// import SearchBar from '@/components/features/SearchBar';
import NewActivityDownV3 from './NewActivityDownV3';
import { usePathname, useRouter } from 'next/navigation';
import { useFetchMembersForNewClass } from '@/hooks/fetch/useActivity';
import { useAuth } from '@/hooks/useAuth';
import { activityRoles, canPerformAction, classRoles, memberRoles } from '@/components/auth/permission/permission';

const NewActivityTable = () => {
    const {user} = useAuth();
    // const [search, setSearch] = useState<string>('');
    const path = usePathname();

    const activityId = path.split('/')[3];

    const {isPending, members} = useFetchMembersForNewClass(activityId);

    const [membersId, setMemberIds] =useState<string[]>([]); 

    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const updater = canPerformAction(user!, 'updater', {activityRoles});
    const creator = canPerformAction(user!, 'creator', {classRoles});
    const router = useRouter()
    // console.log(updater || creator);

    useEffect(()=>{
      if(user && (!updater && !creator)){
        router.replace('/dashboard/forbidden?p=Activity Updater/Class Creator')
      }
    },[creator, updater, user, router])

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
      <div className='table-main2' >
        <div className="w-full flex justify-between p-4 rounded-t border border-slate-300 bg-white dark:bg-[#0F1214]">
          <Subtitle text='Select Members' />
          <div className="flex-center px-3 py-2 rounded border">
              <span className='text-[0.9rem]' >Members selected: <span className='font-semibold' >{membersId.length}</span></span>
          </div>
        </div>
        <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-[#0F1214] p-4">

        
          <div className="flex flex-col gap-2">
            {/* <div className="flex justify-end">
                <SearchBar setSearch={setSearch} reversed={false} />
            </div> */}

              <div className="flex w-full">
                {/* {
                  loading ? 
                  <LinearProgress className='w-full' />
                  : */}
                  <Paper className='w-full' sx={{ height: 'auto', }}>
                      <DataGrid
                        getRowId={(row:IMember)=>row._id}
                        rows={members}
                        columns={NewActivityColumns(membersId, handleCheckClick, showMember, updater, creator)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
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
                        loading={isPending}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                      />
                  </Paper>
                {/* } */}
              </div>
           
              <NewActivityDownV3 updater={updater || creator} members={membersId}/>
           
          </div>
        </div>
      </div>
    )
}

export default NewActivityTable