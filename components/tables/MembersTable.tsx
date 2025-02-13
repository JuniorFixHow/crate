'use client'
import DeleteDialog from '@/components/DeleteDialog';
import { MemberColumns } from '@/components/Dummy/contants';
import SearchBar from '@/components/features/SearchBar';
import { useFetchMembers } from '@/hooks/fetch/useMember';
import { IMember } from '@/lib/database/models/member.model';
import { Alert, LinearProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { Dispatch, SetStateAction,  useState } from 'react'
import { ErrorProps } from '@/types/Types';
import { deleteMember } from '@/lib/actions/member.action';
import { SearchMemberWithEverything } from '../pages/members/fxns';
import MemberInfoModal from '../pages/members/MemberInfoModal';
import { enqueueSnackbar } from 'notistack';
import { ExcelButton } from '../features/Buttons';
import MemberImportModal from '../pages/members/MemberImportModal';

export type MembersTableProps ={
    search:string,
    age:string,
    status:string,
    date:string,
    gender:string,
    setSearch:Dispatch<SetStateAction<string>>
    
}

const MembersTable = ({
    search, setSearch, age, status, date, gender
}:MembersTableProps) => {
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [currentMember, setCurrentMember] = useState<IMember|null>(null);
    const [deleteState, setDeleteState]= useState<ErrorProps>(null);
    const [excelMode, setExcelMode] = useState<boolean>(false);
    
    const paginationModel = { page: 0, pageSize: 10 };
    // console.log(searchMember(search, members))

    const {members, loading} = useFetchMembers();
    

    // I may do this in a hook
    // useEffect(()=>{
    //     const data = searchParams?.get('registeredBy');
    //     if(data){
    //         setMembersData(members.filter((member)=>member.registeredBy === data))
    //     }else{
    //         setMembersData(members);
    //     }

    // },[searchParams])

    const handleDelete=(data:IMember)=>{
        setDeleteMode(true);
        setCurrentMember(data);
    }
    const handleInfo=(data:IMember)=>{
        setInfoMode(true);
        setCurrentMember(data);
    }

    const handleDeleteMember = async()=>{
        setDeleteState(null)
        if(currentMember){
          try {
            await deleteMember(currentMember._id);
            setDeleteMode(false);
            setCurrentMember(null);
            enqueueSnackbar('Member deleted successfully', {variant:'success'});
          } catch (error) {
            console.log(error)
            enqueueSnackbar('Error occured deleting member', {variant:'error'});
          }
        }
      }



    const message=`Are you sure you want to delete this member? This will delete their event registrations as well as attendance records.`

  return (
    <div className='xl:w-[67rem] gap-4 p-6 flex flex-col rounded shadow-xl bg-white dark:bg-[#0F1214] dark:border' >
        <div className="flex flex-row items-center justify-between">
            <span className='font-bold text-xl' >Members</span>
            <div className="flex gap-3 items-center">
              <ExcelButton onClick={()=>setExcelMode(true)} />
              <SearchBar setSearch={setSearch} reversed className='py-1' />
            </div>
        </div>

        {
            deleteState?.message &&
            <Alert onClose={()=>setDeleteState(null)} severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
        }
        <DeleteDialog title={`Delete ${currentMember?.name}`} value={deleteMode} setValue={setDeleteMode} message={message} onTap={handleDeleteMember} />
        <MemberInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentMember={currentMember} setCurrentMember={setCurrentMember} />
        <MemberImportModal infoMode={excelMode} setInfoMode={setExcelMode} />
        <div className="table-main">
        {
          loading ? 
          <LinearProgress className='w-full' />
          :
          <Paper className='' sx={{ height: 400, width:'100%' }}>
              <DataGrid
                  rows={SearchMemberWithEverything(members, gender, status, age, date, search)}
                  getRowId={(row:IMember):string=>row._id}
                  columns={MemberColumns(handleDelete, handleInfo)}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10, 15, 20, 50, 100]}
                  // checkboxSelection
                  className='dark:bg-[#0F1214] dark:border-slate-200 dark:border dark:text-[#3C60CA]'
                  sx={{ border: 0 }}
              />
          </Paper>
        }
        </div>
    </div>
  )
}

export default MembersTable