'use client'
import SearchBar from '@/components/features/SearchBar'
import React, { useEffect, useState } from 'react'
import AssignmentFilter from './AssignmentFilter'
import DeleteDialog from '@/components/DeleteDialog'
import { Alert, LinearProgress, Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { SearchEventRegWithStatus, SearchGroupWithStatus } from './fxn'
import { AssignmentColumns } from './AssignmentColumns'
import {  useFetchRegistrationsWithEvents } from '@/hooks/fetch/useRegistration'
import { useFetchEvents } from '@/hooks/fetch/useEvent'
import { useFetchGroupsForEvent } from '@/hooks/fetch/useGroups'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IGroup } from '@/lib/database/models/group.model'
import { AssColumnsGroup } from './AssColumnsGroup'
import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import { ErrorProps } from '@/types/Types'
import { removeGroupFromAllRooms, removeMemberFromRoom } from '@/lib/actions/room.action'

const AssignmentTable = () => {
    const [status, setStatus] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [isGroup, setIsGroup] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [deleteGroupLoading, setDeleteGroupLoading] = useState<boolean>(false);
    const [deleteMemberLoading, setDeleteMemberLoading] = useState<boolean>(false);
    const [currentAssignment, setCurrentAssignment] = useState<IRegistration|null>(null);
    const [currentAssGroup, setCurrentAssGroup] = useState<IGroup|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);
    const {events} = useFetchEvents();
    const {eventRegistrations, loading} = useFetchRegistrationsWithEvents(eventId)
    const {groups} = useFetchGroupsForEvent(eventId)

    const handleUnassign = (data:IRegistration)=>{
        setCurrentAssignment(data);
        setDeleteMode(true);
        setCurrentAssGroup(null);
    }
    const handleUnassignGroup = (data:IGroup)=>{
        setCurrentAssGroup(data);
        setDeleteMode(true);
        setCurrentAssignment(null);
    }

    const handleRemoveMember = async()=>{
        try {
            setDeleteMemberLoading(true);
            if(currentAssignment){
                const memberId = typeof currentAssignment.memberId === 'object' && currentAssignment.memberId._id;
                const res:ErrorProps = await removeMemberFromRoom(memberId.toString());
                setResponse(res);
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured removing member from room', error:true})
        }finally{
            setDeleteMemberLoading(false);
        }
    }

    const handleRemoveGroup = async()=>{
        try {
            setDeleteGroupLoading(true);
            if(currentAssGroup){
                const res:ErrorProps = await removeGroupFromAllRooms(currentAssGroup._id);
                setResponse(res);
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured removing member from room', error:true})
        }finally{
            setDeleteGroupLoading(false);
        }
    }

    useEffect(()=>{
        if(events.length>0){
            setEventId(events[0]._id);
        }
    },[events])

    const message = `You're about to unassign a room for this member. Continue?`
    const message2 = `You're about to unassign rooms for this member. This will also affect the entire members in this group. Are you sure of what you're doing?`
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

        <DeleteDialog value={deleteMode} setValue={setDeleteMode} onTap={currentAssGroup ? handleRemoveGroup:handleRemoveMember} title='Unassign room' message={currentAssignment ? message:message2} />
        <div className="flex flex-col gap-5 bg-white dark:bg-black rounded border p-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-end">
                    <SearchSelectEvents isGeneric setSelect={setEventId} />
                    <AssignmentFilter setSelect={setStatus} />
                </div>
                <div className="flex items-center gap-2">
                    <SearchBar reversed={false} setSearch={setSearch} />
                </div>
            </div>

            {
                response?.message &&
                <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
            }
            <div className="flex w-full">
            {
                loading?
                <LinearProgress className='w-full' />
                :

              <Paper className='w-full' sx={{ height: 480, }}>
                {
                    isGroup ?
                    <DataGrid
                        rows={SearchGroupWithStatus(groups, search, status)}
                        columns={AssColumnsGroup(handleUnassignGroup, deleteGroupLoading)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        getRowId={(row:IGroup)=>row._id}
                        // checkboxSelection
                        className='dark:bg-black dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                    />
                    :
                  <DataGrid
                      rows={SearchEventRegWithStatus(eventRegistrations, search, status)}
                      columns={AssignmentColumns(handleUnassign, deleteMemberLoading)}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      getRowId={(row:IRegistration)=>row._id}
                      // checkboxSelection
                      className='dark:bg-black dark:border dark:text-blue-800'
                      sx={{ border: 0 }}
                  />
                }
              </Paper>
            }
          </div>

        </div>
    </div>
  )
}

export default AssignmentTable