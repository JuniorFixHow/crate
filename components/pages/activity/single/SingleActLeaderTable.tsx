'use client'
import React, { useEffect, useState } from 'react'
import Subtitle from '@/components/features/Subtitle';
import {  Alert, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IMember } from '@/lib/database/models/member.model';
import { searchMember } from '@/functions/search';
import SearchBar from '@/components/features/SearchBar';
import { MdChecklist } from 'react-icons/md';
import { LuCopyX,  } from 'react-icons/lu';
import { SingleActivityColumns } from './SingleActivityColumns';
import { IoPersonRemoveOutline } from 'react-icons/io5';
import { ErrorProps } from '@/types/Types';
import DeleteDialog from '@/components/DeleteDialog';
// import AddButton from '@/components/features/AddButton';
import SingleActAddMember from './SingleActAddMember';
import { IMinistry } from '@/lib/database/models/ministry.model';
import { removeLeaderMinistry, removeLeadersMinistry } from '@/lib/actions/ministry.action';
import { enqueueSnackbar } from 'notistack';
import { useFetchActivities } from '@/hooks/fetch/useActivity';


type SingleActLeaderTableProps = {
    leaders:IMember[],
    ministry:IMinistry
}

const SingleActLeaderTable = ({leaders, ministry}:SingleActLeaderTableProps) => {

    const [search, setSearch] = useState<string>('');
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentMember, setCurrentMember] = useState<IMember|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);
    const {reload} = useFetchActivities(ministry?._id);

    const [membersId, setMemberIds] =useState<string[]>([]); 
    const [showMember, setShowMember] = useState<boolean>(false);
    const searched = searchMember(search, leaders)?.map((item)=>item?._id);

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

    const handleRemoveLeader = async()=>{
        try {
            if(currentMember){
                const res = await removeLeaderMinistry(ministry?._id, currentMember?._id) as ErrorProps;
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                reload();
                setCurrentMember(null);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing leader', {variant:'error'});
        }
    }

  

    const handleRemoveLeaders = async()=>{
        try {
            if(membersId?.length){
                const res = await removeLeadersMinistry(ministry?._id, membersId) as ErrorProps;
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                reload();
                setMemberIds([]);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured removing leaders', error:true})
        }
    }

    const message = currentMember ? `Remove ${currentMember?.name} from this activity as a leader. Continue?`
    : `Remove ${membersId?.length} leader(s) from this activity. Continue?`;

    const paginationModel = { page: 0, pageSize: 10 };
    return (
      <div className='w-full flex flex-col' >
        <div className="w-full flex justify-between p-4 rounded-t border border-slate-300 bg-white dark:bg-[#0F1214]">
          <Subtitle text='Leaders' />
          <div className="flex-center px-3 py-2 rounded border">
            <span className='text-[0.9rem]' >Leaders selected: <span className='font-semibold' >{membersId.length}</span></span>
          </div>
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
                            
                            <div onClick={handleDeleteMode}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                                <div className="flex-center p-1 bg-slate-400 rounded-full">
                                <IoPersonRemoveOutline />
                                </div>
                                <span className="dark:text-black text-sm" >Demote</span>
                            </div>
                        </div>
                }
                
            </div>  

            <DeleteDialog title='Remove Leader(s)' 
                onTap={currentMember?handleRemoveLeader:handleRemoveLeaders} 
                message={message}
                value={deleteMode} setValue={setDeleteMode}
            />

            <SingleActAddMember ministryId={ministry?._id} setShowMember={setShowMember} showMember={showMember} />

            {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
            }

          <div className="flex flex-col gap-2">
            <div className="flex justify-end gap-4">
                <SearchBar setSearch={setSearch} reversed={false} />
                {/* <AddButton onClick={()=>setShowMember(true)}  className='rounded' noIcon smallText text='Add Members' /> */}
            </div>

              <div className="flex w-full">
                {
                
                  <Paper className='w-full' sx={{ height: 480, }}>
                      <DataGrid
                        getRowId={(row:IMember)=>row._id}
                        rows={searchMember(search, leaders)}
                        columns={SingleActivityColumns(membersId, handleCheckClick, handleDelete)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
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

export default SingleActLeaderTable