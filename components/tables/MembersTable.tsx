'use client'
import DeleteDialog from '@/components/DeleteDialog';
import { MemberColumns } from '@/components/Dummy/contants';
// import SearchBar from '@/components/features/SearchBar';
import { useFetchMembers } from '@/hooks/fetch/useMember';
import { IMember } from '@/lib/database/models/member.model';
import { Alert,  Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import  {  useState } from 'react'
import { ErrorProps } from '@/types/Types';
import { deleteMember } from '@/lib/actions/member.action';
// import { SearchMemberWithEverything } from '../pages/members/fxns';
import MemberInfoModal from '../pages/members/MemberInfoModal';
import { enqueueSnackbar } from 'notistack';
import { ExcelButton } from '../features/Buttons';
import MemberImportModal from '../pages/members/MemberImportModal';
import AddButton from '../features/AddButton';
import Link from 'next/link';



const MembersTable = () => {
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [currentMember, setCurrentMember] = useState<IMember|null>(null);
    const [deleteState, setDeleteState]= useState<ErrorProps>(null);
    const [excelMode, setExcelMode] = useState<boolean>(false);
    
    const paginationModel = { page: 0, pageSize: 15 };
    // console.log(searchMember(search, members))

    const {members, loading} = useFetchMembers();
    

     

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
    <div className='w-1/3 md:w-1/2 lg:w-4/5 xl:w-full bg-white gap-4 p-4 flex flex-col rounded shadow-xl dark:bg-[#0F1214] dark:border' >
        <div className="flex flex-col gap-2 md:flex-row items-center justify-between">
            <span className='font-bold text-xl' >Members</span>
            <div className="flex gap-3 items-center">
              <ExcelButton onClick={()=>setExcelMode(true)} />
              <Link href={`/dashboard/members/new`} >
                <AddButton  text='Add Member' smallText className="w-fit rounded"  />
              </Link>
              {/* <SearchBar setSearch={setSearch} reversed className='py-1' /> */}
            </div>
        </div>

        {
            deleteState?.message &&
            <Alert onClose={()=>setDeleteState(null)} severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
        }
        <DeleteDialog title={`Delete ${currentMember?.name}`} value={deleteMode} setValue={setDeleteMode} message={message} onTap={handleDeleteMember} />
        <MemberInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentMember={currentMember} setCurrentMember={setCurrentMember} />
        <MemberImportModal infoMode={excelMode} setInfoMode={setExcelMode} />
        <div className="flex flex-col ">
        {
          // loading ? 
          // <LinearProgress className='w-full' />
          // :
          <Paper className='bg-blue-300' sx={{ height: 'auto', }}>
              <DataGrid
                  rows={members}
                  getRowId={(row:IMember):string=>row._id}
                  columns={MemberColumns(handleDelete, handleInfo)}
                  initialState={{ pagination: { paginationModel },  
                  // scroll: { top: 1000, left: 1000 },
                }}
                  pageSizeOptions={[5, 10, 15, 20, 50, 100]}
                  // dis
                  slots={{toolbar:GridToolbar}}
                  loading={loading}
                  slotProps={{
                    toolbar:{
                      showQuickFilter:true,
                      printOptions:{
                        // disableToolbarButton:false,
                        hideToolbar:true,
                        hideFooter:true,
                        
                      }
                    }
                  }}
                  // checkboxSelection
                  className='dark:bg-[#0F1214] dark:border-slate-200 dark:border dark:text-[#3C60CA]'
                  sx={{ border: 0,}}
              />
          </Paper>
        }
        </div>
    </div>
  )
}

export default MembersTable