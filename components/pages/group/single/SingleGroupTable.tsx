'use client'
import AddButton from '@/components/features/AddButton';
import Subtitle from '@/components/features/Subtitle';
import { Alert, LinearProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { SingleGroupColumns } from './SingleGroupsColumns';
import NewGroupMember from './NewGroupMember';
import DeleteDialog from '@/components/DeleteDialog';
import SingleGroupDown from './SingleGroupDown';
import { IGroup } from '@/lib/database/models/group.model';
import { deleteGroup, getGroup, removeMemberFromGroup } from '@/lib/actions/group.action';
import { IRegistration } from '@/lib/database/models/registration.model';
import { getRegistrationsByGroup } from '@/lib/actions/registration.action';
import { IMember } from '@/lib/database/models/member.model';
import { ErrorProps } from '@/types/Types';
import { useRouter, useSearchParams } from 'next/navigation';
import GroupRooms from './GroupRooms';
import SelectRoomsForGroups from './SelectRoomsForGroups';

const SingleGroupTable = ({id}:{id:string}) => {
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentGroup, setCurrentGroup]= useState<IGroup|null>(null);
    const paginationModel = { page: 0, pageSize: 10 };
    const [loading, setLoading] = useState<boolean>(true);
    const [registrations, setRegistrations] = useState<IRegistration[]>([]);
    const [removeModde, setRemoveMode] = useState<boolean>(false);
    const [currentMember, setCurrentMember] = useState<IMember|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [viewmode, setViewmode] = useState<string>('Details');
    const [showRooms, setShowRooms] = useState<boolean>(false);
    const router = useRouter();

    const searchParams = useSearchParams();

    useEffect(() => {
      const fetchGroup = async () => {
        if (id) {
          try {
            const [group, regs] = await Promise.all([
              getGroup(id), 
              getRegistrationsByGroup(id) 
            ]);
            
            setCurrentGroup(group);
            setRegistrations(regs);
            // console.log('registrations: ',regs);
        
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }
      };
    
      fetchGroup();
    }, [id]);


    useEffect(()=>{
      const id = searchParams.get('tab');
      if(id){
        setViewmode('Rooms');
      }
    },[searchParams])

    
    const handleRemove = (data:IMember)=>{
      setRemoveMode(true);
      setCurrentMember(data)
    }

    const handleDeleteGroup = async()=>{
      try {
        if(currentGroup){
          await deleteGroup(currentGroup._id)
          setResponse({message:'Group removed successfully', error:false});
          setDeleteMode(false);
          router.push('/dashboard/groups')
        }
      } catch (error) {
        console.log(error);
        setResponse({message:'Error occured deleteing group', error:true});
      }
    }

    // console.log('ShowRoom: ', showRooms)

    const handleRemoveMember = async()=>{
      try {
        if(currentGroup && currentMember){
          const eventId = typeof currentGroup.eventId === 'object' && '_id' in currentGroup.eventId && currentGroup?.eventId._id;
          if(eventId){
            await removeMemberFromGroup(currentGroup._id, currentMember._id, eventId.toString());
            setResponse({message:'Member removed successfully', error:false});
            setRemoveMode(false);
          }
        }
      } catch (error) {
        console.log(error);
        setResponse({message:'Error occured deleteing group', error:true});
      }
    }

    // console.log('Group: ', currentGroup)
    const warn = `You're about to remove this member from the group. Are you aware?`
    const message = `Deleting will remove all members in the group as well. You're rather advised to remove the unwanted members. Do you still want to delete the group?`
  return (
    <div className='w-full flex flex-col' >
      <div className="w-full flex justify-between p-4 rounded-t border border-slate-300 bg-white dark:bg-[#0F1214]">
        <div className="flex gap-10">
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
            {
              !(currentGroup?.type === 'Couple' && currentGroup?.eligible >= 2) &&
              <AddButton onClick={()=>setNewMode(true)} text='Add a member' smallText className='rounded' />
            }
            <AddButton onClick={()=>setShowRooms(true)} noIcon smallText className='rounded' text={(currentGroup?.roomIds && currentGroup?.roomIds.length >0) ? 'Add Rooms' :'Assign Rooms'} />
        </div>
        <AddButton onClick={()=>setDeleteMode(true)} text='Delete Group' className='rounded' noIcon smallText isDanger />
      </div>
      <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-[#0F1214] p-4">
        <DeleteDialog onTap={handleDeleteGroup} message={message} setValue={setDeleteMode} value={deleteMode} title={`Delete ${currentGroup?.name}`} />
        <DeleteDialog onTap={handleRemoveMember} message={warn} setValue={setRemoveMode} value={removeModde} title={`Remove ${currentMember?.name}`} />
        <NewGroupMember infoMode={newMode} setInfoMode={setNewMode} currentGroup={currentGroup} />

       
        <SelectRoomsForGroups currentGroup={currentGroup} setShowRooms={setShowRooms} showRooms={showRooms} />

        <div className="flex flex-col gap-2">
          {
            response?.message &&
            <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
          }


          {
            viewmode === 'Details' ?
            <div className="flex w-full">
              {
                loading?
                <LinearProgress className='w-full' />
                :
                <Paper className='w-full' sx={{ height: 480, }}>
                    <DataGrid
                      rows={registrations}
                      getRowId={(row:IRegistration)=>row._id}
                      columns={SingleGroupColumns(handleRemove)}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      // checkboxSelection
                      className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                      sx={{ border: 0 }}
                    />
                </Paper>
              }
            </div>

            :
            <GroupRooms currentGroup={currentGroup} />

          }

            <SingleGroupDown setCurrentGroup={setCurrentGroup!} currentGroup={currentGroup!} />
          
        </div>
      </div>
    </div>
  )
}

export default SingleGroupTable