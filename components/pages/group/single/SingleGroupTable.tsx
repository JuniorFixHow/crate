'use client'
import AddButton from '@/components/features/AddButton';
import Subtitle from '@/components/features/Subtitle';
import { Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { SingleGroupColumns } from './SingleGroupsColumns';
import NewGroupMember from './NewGroupMember';
import DeleteDialog from '@/components/DeleteDialog';
import SingleGroupDown from './SingleGroupDown';
import { IGroup } from '@/lib/database/models/group.model';
import { deleteGroup,  removeMemberFromGroup } from '@/lib/actions/group.action';
import { IRegistration } from '@/lib/database/models/registration.model';
import { getRegistrationsByGroup } from '@/lib/actions/registration.action';
import { IMember } from '@/lib/database/models/member.model';
// import { ErrorProps } from '@/types/Types';
import { useRouter, useSearchParams } from 'next/navigation';
import GroupRooms from './GroupRooms';
import SelectRoomsForGroups from './SelectRoomsForGroups';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { IEvent } from '@/lib/database/models/event.model';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, eventRegistrationRoles, groupRoles, groupRolesExtended, isChurchAdmin, isSuperUser, isSystemAdmin, roomRolesExtended } from '@/components/auth/permission/permission';

type SingleGroupTableProps = {
  currentGroup:IGroup
}

const SingleGroupTable = ({currentGroup}:SingleGroupTableProps) => {
    const {user} = useAuth();
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [currentGroup, setCurrentGroup]= useState<IGroup|null>(null);
    const paginationModel = { page: 0, pageSize: 10 };
    // const [loading, setLoading] = useState<boolean>(true);
    // const [registrations, setRegistrations] = useState<IRegistration[]>([]);
    const [removeModde, setRemoveMode] = useState<boolean>(false);
    const [currentMember, setCurrentMember] = useState<IMember|null>(null);
    // const [response, setResponse] = useState<ErrorProps>(null);
    const [viewmode, setViewmode] = useState<string>('Details');
    const [showRooms, setShowRooms] = useState<boolean>(false);
    const router = useRouter();

    const searchParams = useSearchParams();

    const reader = canPerformAction(user!, 'reader', {eventRegistrationRoles});
    const deleter = canPerformAction(user!, 'deleter', {groupRoles});
    const groupUpdater = canPerformAction(user!, 'updater', {groupRoles});
    const groupReader = canPerformAction(user!, 'reader', {groupRoles});
    const groupAssign = groupRolesExtended.assign(user!) || isChurchAdmin.creator(user!) || isSystemAdmin.creator(user!) || isSuperUser(user!);
    const roomAssign = roomRolesExtended.assign(user!) || isChurchAdmin.creator(user!) || isSystemAdmin.creator(user!) || isSuperUser(user!);
    
    useEffect(()=>{
      if(user && (!deleter && !groupUpdater && !groupReader && !groupAssign)){
        router.replace('/dashboard/forbidden?p=Group Reader')
      }
    },[deleter, groupAssign, groupReader, groupUpdater, user, router])

    const fetchRegistrations = async ():Promise<IRegistration[]> => {
      try {
        if(!currentGroup) return [];
        const regs:IRegistration[]  =  await getRegistrationsByGroup(currentGroup?._id);
        return regs;
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    
    const {data:registrations=[], isPending:loading, refetch} = useQuery({
      queryKey:['group', currentGroup?._id],
      queryFn:fetchRegistrations,
      enabled:!!currentGroup
    })
    
    useEffect(()=>{
      const id = searchParams.get('tab');
      if(id){
        setViewmode('Rooms');
      }
    },[searchParams])
    
    const handleRemove = (data:IMember)=>{
      setRemoveMode(true);
      setCurrentMember(data);
    }

    const handleDeleteGroup = async()=>{
      try {
        if(currentGroup){
          const res = await deleteGroup(currentGroup._id)
          enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
          setDeleteMode(false);
          router.push('/dashboard/groups')
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured deleteing group', {variant:'error'});
      }
    }

    // console.log('ShowRoom: ', showRooms)

    const handleRemoveMember = async()=>{
      try {
        const event = currentGroup?.eventId as IEvent;
        if(currentMember){
          const res = await removeMemberFromGroup(currentGroup._id, currentMember._id, event._id);
          enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
          setRemoveMode(false);
          refetch()
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured removing member from group', {variant:'error'});
      }
    }

    // console.log('Group: ', currentGroup)
    const warn = `You're about to remove this member from the group. Are you aware?`
    const message = `Deleting will remove all members in the group as well. You're rather advised to remove the unwanted members. Do you still want to delete the group?`

    if(!deleter && !groupUpdater && !groupReader && !groupAssign) return;

  return (
    <div className='table-main2' >
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:gap-10">
            <Subtitle text={currentGroup ? currentGroup?.name:''} />
            {
              currentGroup &&
              <div className="flex gap-5">
                <button type='button' onClick={()=>setViewmode('Details')}  className={`text-[0.8rem] font-bold ${viewmode === 'Details' && 'border-b-2 rounded-b border-b-blue-600'}`} >Members</button>
                {
                  currentGroup.roomIds && currentGroup.roomIds?.length > 0 &&
                  <button type='button' onClick={()=>setViewmode('Rooms')}  className={`text-[0.8rem] font-bold ${viewmode === 'Rooms' && 'border-b-2 rounded-b border-b-blue-600'}`} >Rooms</button>
                }
              </div>
            }

            <div className="flex items-center gap-4">
              {
                !(currentGroup?.type === 'Couple' && currentGroup?.eligible >= 2) && groupAssign &&
                <AddButton onClick={()=>setNewMode(true)} text='Add a member' smallText className='rounded' />
              }
              {
                roomAssign &&
                <AddButton onClick={()=>setShowRooms(true)} noIcon smallText className='rounded' text={(currentGroup?.roomIds && currentGroup?.roomIds.length >0) ? 'Add Rooms' :'Assign Rooms'} />
              }
            </div>
        </div>
        {
          deleter &&
          <AddButton onClick={()=>setDeleteMode(true)} text='Delete Group' className='rounded w-fit' noIcon smallText isDanger />
        }
      </div>
      <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-[#0F1214] p-4">
        <DeleteDialog onTap={handleDeleteGroup} message={message} setValue={setDeleteMode} value={deleteMode} title={`Delete ${currentGroup?.name}`} />
        <DeleteDialog onTap={handleRemoveMember} message={warn} setValue={setRemoveMode} value={removeModde} title={`Remove ${currentMember?.name}`} />
        <NewGroupMember infoMode={newMode} setInfoMode={setNewMode} currentGroup={currentGroup} />

       
        <SelectRoomsForGroups user={user!} currentGroup={currentGroup} setShowRooms={setShowRooms} showRooms={showRooms} />

        <div className="flex flex-col gap-2">
          {/* {
            response?.message &&
            <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
          } */}


          {
            viewmode === 'Details' ?
            <div className="flex w-full">
              <Paper className='w-full' sx={{ height: 'auto', }}>
                  <DataGrid
                    rows={registrations}
                    loading={loading}
                    getRowId={(row:IRegistration)=>row._id}
                    columns={SingleGroupColumns(handleRemove, reader, groupAssign)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20, 30, 50, 100]}
                    slots={{toolbar:GridToolbar}}
                    slotProps={{
                      toolbar:{
                        showQuickFilter:true,
                        printOptions:{
                          hideFooter:true,
                          hideToolbar:true
                        }
                      },
                    }}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                  />
              </Paper>
            </div>

            :
            <GroupRooms user={user!} roomAssign={roomAssign} currentGroup={currentGroup} />

          }

            <SingleGroupDown groupUpdater={groupUpdater} currentGroup={currentGroup!} />
          
        </div>
      </div>
    </div>
  )
}

export default SingleGroupTable