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
    const [currentMember, setCurrentMember] = useState<IMember|null>(null);
    const [deleteState, setDeleteState]= useState<ErrorProps>(null);
    
    const paginationModel = { page: 0, pageSize: 5 };
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

    const handleDeleteMember = async()=>{
        setDeleteState(null)
        if(currentMember){
          try {
            await deleteMember(currentMember._id);
            setDeleteMode(false);
            setCurrentMember(null);
            setDeleteState({message:'Member deleted successfully', error:false})
          } catch (error) {
            console.log(error)
            setDeleteState({message:'Error occured deleting member', error:true})
          }
        }
      }



    const message=`Are you sure you want to delete this member?`

  return (
    <div className='xl:w-[67rem] gap-4 p-6 flex flex-col rounded shadow-xl bg-white dark:bg-black dark:border' >
        <div className="flex flex-row items-center justify-between">
            <span className='font-bold text-xl' >Members</span>
            <SearchBar setSearch={setSearch} reversed />
        </div>

        {
            deleteState?.message &&
            <Alert onClose={()=>setDeleteState(null)} severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
        }
        <DeleteDialog title={`Delete ${currentMember?.name}`} value={deleteMode} setValue={setDeleteMode} message={message} onTap={handleDeleteMember} />

        <div className="flex lg:w-full w-2/3 relative">
        {
          loading ? 
          <LinearProgress className='w-full' />
          :
          <Paper className='' sx={{ height: 400, width:'100%' }}>
              <DataGrid
                  rows={SearchMemberWithEverything(members, gender, status, age, date, search)}
                  getRowId={(row:IMember):string=>row._id}
                  columns={MemberColumns(handleDelete)}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  // checkboxSelection
                  className='dark:bg-black dark:border-slate-200 dark:border dark:text-[#3C60CA]'
                  sx={{ border: 0 }}
              />
          </Paper>
        }
        </div>
    </div>
  )
}

export default MembersTable