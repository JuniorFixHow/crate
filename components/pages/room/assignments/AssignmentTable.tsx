'use client'
// import SearchBar from '@/components/features/SearchBar'
import React, { useEffect, useState } from 'react'
// import AssignmentFilter from './AssignmentFilter'
import DeleteDialog from '@/components/DeleteDialog'
import {  Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { SearchEventRegWithChurch,  SearchGroupWithChurch } from './fxn'
import { AssignmentColumns } from './AssignmentColumns'
import {  useFetchRegistrationsWithoutChurch } from '@/hooks/fetch/useRegistration'
import { useFetchEvents } from '@/hooks/fetch/useEvent'
import { useFetchGroupsForEvent } from '@/hooks/fetch/useGroups'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IGroup } from '@/lib/database/models/group.model'
import { AssColumnsGroup } from './AssColumnsGroup'
// import SearchSelectEvents from '@/components/features/SearchSelectEvents'
// import { ErrorProps } from '@/types/Types'
import { removeGroupFromAllRooms, removeMemberFromRoom } from '@/lib/actions/room.action'
// import SearchSelectZones from '@/components/features/SearchSelectZones'
// import SearchSelectChurchForRoomAss from '@/components/features/SearchSelectChurchForRoomAss'
import SearchSelectChurchesV2 from '@/components/features/SearchSelectChurchesV2'
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2'
import { IMember } from '@/lib/database/models/member.model'
import { enqueueSnackbar } from 'notistack'
import { useAuth } from '@/hooks/useAuth'
import { checkIfAdmin } from '@/components/Dummy/contants'

const AssignmentTable = () => {
    // const [status, setStatus] = useState<string>('');
    // const [search, setSearch] = useState<string>('');
    const [isGroup, setIsGroup] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    // const [zoneId, setZoneId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [deleteGroupLoading, setDeleteGroupLoading] = useState<boolean>(false);
    const [deleteMemberLoading, setDeleteMemberLoading] = useState<boolean>(false);
    const [currentAssignment, setCurrentAssignment] = useState<IRegistration|null>(null);
    const [currentAssGroup, setCurrentAssGroup] = useState<IGroup|null>(null);
    // const [response, setResponse] = useState<ErrorProps>(null);
    const {events} = useFetchEvents();
    const {eventRegistrations, loading:fetching, refetch:reload} = useFetchRegistrationsWithoutChurch(eventId)
    const {groups, loading:rendering, refetch:regroup} = useFetchGroupsForEvent(eventId)

    const {user} = useAuth();
    const isAdmin = checkIfAdmin(user);

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
                const member = currentAssignment?.memberId as IMember;
                const res = await removeMemberFromRoom(member?._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                reload();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing member from room', {variant:'error'});
        }finally{
            setDeleteMemberLoading(false);
        }
    }

    const handleRemoveGroup = async()=>{
        try {
            setDeleteGroupLoading(true);
            if(currentAssGroup){
                const res = await removeGroupFromAllRooms(currentAssGroup._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                regroup();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing group from room', {variant:'error'});
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

    const cId =  isAdmin ? churchId : user?.churchId;

    if(!user) return null;
    
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
        <div className="table-main2">
            <div className="flex justify-between items-center">
                {
                    isAdmin &&
                    <div className="flex gap-4 items-end">
                        <SearchSelectChurchesV2  setSelect={setChurchId} />
                    </div>
                }

            </div>
                
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-end">
                    <SearchSelectEventsV2 setSelect={setEventId} />
                    {/* <AssignmentFilter setSelect={setStatus} /> */}
                </div>
                {/* <div className="flex items-center gap-2">
                    <SearchBar reversed={false} setSearch={setSearch} />
                </div> */}
            </div>

            {/* {
                response?.message &&
                <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
            } */}
            <div className="flex w-full">
           
              <Paper className='w-full' sx={{ height: 'auto', }}>
                {
                    isGroup ?
                    <DataGrid
                        rows={SearchGroupWithChurch(groups, cId!)}
                        columns={AssColumnsGroup(handleUnassignGroup, deleteGroupLoading)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                        getRowId={(row:IGroup)=>row._id}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                        loading={rendering && !!eventId}
                        slots={{toolbar:GridToolbar}}
                        slotProps={{
                            toolbar:{
                                showQuickFilter:true,
                                printOptions:{
                                    hideFooter:true,
                                    hideToolbar:true,
                                }
                            }
                        }}
                    />
                    :
                  <DataGrid
                      rows={SearchEventRegWithChurch(eventRegistrations, cId!)}
                      columns={AssignmentColumns(handleUnassign, deleteMemberLoading)}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                      getRowId={(row:IRegistration)=>row._id}
                      // checkboxSelection
                      className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                      sx={{ border: 0 }}
                      loading={fetching && !!eventId}
                      slots={{toolbar:GridToolbar}}
                      slotProps={{
                        toolbar:{
                            showQuickFilter:true,
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true,
                            }
                        }
                      }}
                  />
                }
              </Paper>
          </div>

        </div>
    </div>
  )
}

export default AssignmentTable