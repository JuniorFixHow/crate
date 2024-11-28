'use client'
import { EventRegistrations } from '@/components/Dummy/Data';
import AddButton from '@/components/features/AddButton';
import Subtitle from '@/components/features/Subtitle';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { SingleGroupColumns } from './SingleGroupsColumns';
import { GroupData } from '../GroupData';
import { GroupProps } from '@/types/Types';
import NewGroupMember from './NewGroupMember';
import DeleteDialog from '@/components/DeleteDialog';
import SingleGroupDown from './SingleGroupDown';

const SingleGroupTable = ({id}:{id:string}) => {
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentGroup, setCurrentGroup]= useState<GroupProps|null>(null);
    const paginationModel = { page: 0, pageSize: 10 };

    useEffect(()=>{
        if(id){
            const group = GroupData.filter((group)=>group.id === id)[0]
            setCurrentGroup(group);
        }
    },[id])
    const message = `Deleting will remove all members in the group as well. You're rather advised to remove the unwanted members. Do you still want to delete the group?`
  return (
    <div className='w-full flex flex-col' >
      <div className="w-full flex justify-between p-4 rounded-t border border-slate-300 bg-white dark:bg-black">
        <div className="flex gap-4">
            <Subtitle text={currentGroup?.name!} />
            <AddButton onClick={()=>setNewMode(true)} text='Add a member' smallText className='rounded' />
        </div>
        <AddButton onClick={()=>setDeleteMode(true)} text='Delete' className='rounded' noIcon smallText isDanger />
      </div>
      <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-black p-4">
        <DeleteDialog onTap={()=>{}} message={message} setValue={setDeleteMode} value={deleteMode} title={`Delete ${currentGroup?.name}`} />
        <NewGroupMember infoMode={newMode} setInfoMode={setNewMode} currentGroup={currentGroup} setCurrentGroup={setCurrentGroup} />
        <div className="flex flex-col gap-2">

          <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                  rows={EventRegistrations.filter(item=>item.regType!=='Individual')}
                  columns={SingleGroupColumns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  // checkboxSelection
                  className='dark:bg-black dark:border dark:text-blue-800'
                  sx={{ border: 0 }}
                />
            </Paper>
          </div>

            <SingleGroupDown currentGroup={currentGroup} />
          
        </div>
      </div>
    </div>
  )
}

export default SingleGroupTable