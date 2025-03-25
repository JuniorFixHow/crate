'use client'
import React, { useEffect, useState } from 'react'
import Subtitle from '@/components/features/Subtitle';
import {  Alert, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IMember } from '@/lib/database/models/member.model';
import { searchMember } from '@/functions/search';
// import SearchBar from '@/components/features/SearchBar';
import { MdChecklist } from 'react-icons/md';
import { LuCopyX,  } from 'react-icons/lu';
import { SingleActivityColumns } from './SingleActivityColumns';
import { GoShieldLock } from 'react-icons/go';
import { IoPersonRemoveOutline } from 'react-icons/io5';
import { ErrorProps } from '@/types/Types';
import DeleteDialog from '@/components/DeleteDialog';
import AddButton from '@/components/features/AddButton';
import SingleActAddMember from './SingleActAddMember';
import { IMinistry } from '@/lib/database/models/ministry.model';
import { makeLeaderMinistry, removeMemberMinistry, removeMembersMinistry } from '@/lib/actions/ministry.action';
import { enqueueSnackbar } from 'notistack';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import SearchBar from '@/components/features/SearchBar';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, memberRoles } from '@/components/auth/permission/permission';


type SingleActMemberTableProps = {
    members:IMember[],
    ministry:IMinistry;
    updater:boolean,
    reload: (options?: RefetchOptions) => Promise<QueryObserverResult<IMinistry | ErrorProps, Error>>
}

const SingleActMemberTable = ({members, reload, updater, ministry}:SingleActMemberTableProps) => {
    const {user} = useAuth();
    const [search, setSearch] = useState<string>('');
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentMember, setCurrentMember] = useState<IMember|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);

    const [membersId, setMemberIds] =useState<string[]>([]); 
    const [showMember, setShowMember] = useState<boolean>(false);
    const searched = members?.map((item)=>item?._id);

    const readMember = canPerformAction(user!, 'reader', {memberRoles});

    useEffect(()=>{
        if(deleteMode === false){
            setCurrentMember(null);
        }
    },[deleteMode])

    const handleCheckClick = (id:string)=>{
        setMemberIds((prev)=>{
            return prev.includes(id) ?
            prev.filter((item)=>item !== id)
            :
            [...prev, id]
        })
    }

    const handleDelete = (data:IMember)=>{
        setCurrentMember(data);
        setDeleteMode(true);
    }

    const handleDeleteMode = ()=>{
        setCurrentMember(currentMember);
        setDeleteMode(true);
    }

    const handleRemoveMember = async()=>{
        try {
            if(currentMember){
                const res = await removeMemberMinistry(ministry?._id, currentMember?._id) as ErrorProps;
                setResponse(res);
                setDeleteMode(false);
                setCurrentMember(null);
                reload();
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured removing member', error:true})
        }
    }

    const handleMakeLeader = async()=>{
        try {
            if(membersId?.length){
                const res = await makeLeaderMinistry(ministry?._id, membersId) as ErrorProps;
                setResponse(res);
                setDeleteMode(false);
                setCurrentMember(null);
                reload();
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured removing member', error:true})
        }
    }

    const handleRemoveMembers = async()=>{
        try {
            if(membersId?.length){
                const res = await removeMembersMinistry(ministry?._id, membersId) as ErrorProps;
                setResponse(res);
                setDeleteMode(false);
                setMemberIds([]);
                reload();
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured removing member', error:true})
        }
    }

    const message = currentMember ? `Remove ${currentMember?.name} from this activity. Continue?`
    : `Remove ${membersId?.length} member(s) from this activity. Continue?`;

    const paginationModel = { page: 0, pageSize: 10 };
    return (
      <div className='table-main2' >
        <div className="w-full flex justify-between p-4 rounded-t border border-slate-300 bg-white dark:bg-[#0F1214]">
          <Subtitle text='Members' />
          {
            updater &&
            <div className="flex-center px-3 py-2 rounded border">
                <span className='text-[0.9rem]' >Members selected: <span className='font-semibold' >{membersId.length}</span></span>
            </div>
          }
        </div>
        <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-[#0F1214] p-4">

            <div className="flex items-center justify-between">
                {
                     membersId.length > 0 &&
                        <div className="flex gap-4 items-center">
                            <div onClick={()=>setMemberIds(searched)}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                                <div className="flex-center p-1 bg-slate-400 rounded-full">
                                    <MdChecklist />
                                </div>
                                <span className="dark:text-black text-sm" >Select All</span>
                            </div>
                            <div onClick={()=>setMemberIds([])}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                                <div className="flex-center p-1 bg-slate-400 rounded-full">
                                    <LuCopyX />
                                </div>
                                <span className="dark:text-black text-sm" >Cancel Selections</span>
                            </div>
                            <div onClick={handleMakeLeader}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                                <div className="flex-center p-1 bg-slate-400 rounded-full">
                                <GoShieldLock />
                                </div>
                                <span className="dark:text-black text-sm" >Make Leader</span>
                            </div>
                            <div onClick={handleDeleteMode}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                                <div className="flex-center p-1 bg-slate-400 rounded-full">
                                <IoPersonRemoveOutline />
                                </div>
                                <span className="dark:text-black text-sm" >Remove</span>
                            </div>
                        </div>
                }
                
            </div>  

            <DeleteDialog title='Remove member(s)' 
                onTap={currentMember?handleRemoveMember:handleRemoveMembers} 
                message={message}
                value={deleteMode} setValue={setDeleteMode}
            />

            <SingleActAddMember readMember={readMember} reload={reload} ministryId={ministry?._id} setShowMember={setShowMember} showMember={showMember} />

            {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
            }

          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:justify-end gap-4">
                <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
                {
                    updater &&
                    <AddButton onClick={()=>setShowMember(true)}  className='rounded flex-center' noIcon smallText text='Add Members' />
                }
            </div>

              <div className="flex w-full">
                {
                  <Paper className='w-full' sx={{ height: 'auto', }}>
                      <DataGrid
                        getRowId={(row:IMember)=>row._id}
                        rows={searchMember(search, members)}
                        columns={SingleActivityColumns(membersId, handleCheckClick, handleDelete, readMember, updater)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50, 50, 100]}
                        slots={{toolbar:GridToolbar}}
                        slotProps={{
                            toolbar:{
                                showQuickFilter:false,
                                printOptions:{
                                    hideFooter:true,
                                    hideToolbar:true
                                }
                            }
                        }}
                        disableColumnFilter
                        
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                      />
                  </Paper>
                }
              </div>
           
            
          </div>
        </div>
      </div>
    )
}

export default SingleActMemberTable