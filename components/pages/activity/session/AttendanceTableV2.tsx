// import SearchBar from "@/components/features/SearchBar";
import { Alert,  Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { useRouter } from "next/router";
import { useState } from "react";

import { ErrorProps } from "@/types/Types";
import { IClasssession } from "@/lib/database/models/classsession.model";
import { ICAttendance } from "@/lib/database/models/classattendance.model";
import { deleteCAttendance } from "@/lib/actions/cattendance.action";
import { enqueueSnackbar } from "notistack";
import DeleteDialog from "@/components/DeleteDialog";
import { AttendanceColumnsV2 } from "./AttendanceColumnsV2";
// import { searchAttenanceV2 } from "./fxn";
import { useFetchCAttendances } from "@/hooks/fetch/useCAttendance";
import { useAuth } from "@/hooks/useAuth";
import { canPerformAction, classAttendanceRoles, classSessionRoles } from "@/components/auth/permission/permission";

type AttendanceTableV2Props = {
    currentSession:IClasssession
}

const AttendanceTableV2 = ({currentSession}:AttendanceTableV2Props) => {
    const {user} = useAuth();
    // const [search, setSearch] = useState<string>('');
    const [currentAttendance, setCurrentAttendance] = useState<ICAttendance|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [deleteState, setDeleteState] = useState<ErrorProps>(null);

    const paginationModel = { page: 0, pageSize: 10 };
    // const router = useRouter();
    const {attendances, isPending, refetch} = useFetchCAttendances(currentSession?._id);
    const reader = canPerformAction(user!, 'reader', {classAttendanceRoles});
    const deleter = canPerformAction(user!, 'deleter', {classAttendanceRoles});
    const showMember = canPerformAction(user!, 'reader', {classAttendanceRoles});
    const showSession = canPerformAction(user!, 'reader', {classSessionRoles});

    if(!currentSession) return null
    const handleDelete = (data:ICAttendance)=>{
        setDeleteMode(true);
        setCurrentAttendance(data);
    }

    const handleDeleteAttendance = async()=>{
        try {
            if(currentAttendance){
                const res = await deleteCAttendance(currentAttendance?._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting the record', {variant:'error'});
        }
    }

    const message = `You're about to delete this attendance record. Have you thought this through?`

  return (
    <div className="table-main2">
        {/* <div className="flex items-center flex-row justify-between w-full">
            <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
        </div> */}
        <DeleteDialog message={message} onTap={handleDeleteAttendance} value={deleteMode} setValue={setDeleteMode} title="Delete Record" />

        {
            deleteState?.message &&
            <Alert onClose={()=>setDeleteState(null)} severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
        }
        <div className="">
            
            <Paper className='' sx={{ height: 'auto', }}>
                {
                    reader ?
                    <DataGrid
                        rows={attendances}
                        columns={AttendanceColumnsV2(handleDelete, deleter, showMember, showSession)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                        getRowId={(row:ICAttendance)=>row._id}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:text-blue-800'
                        sx={{ border: 0 }}
                        loading={isPending}
                        slots={{toolbar:GridToolbar}}
                        slotProps={{
                            toolbar:{
                                showQuickFilter:true,
                                printOptions:{
                                    hideFooter:true,
                                    hideToolbar:true
                                }
                            }
                        }}
                    />
                    :
                    <span className="text-2xl text-red-700 font-semibold text-center" >Limited access</span>
                }
            </Paper>
        </div>
    </div>
  )
}

export default AttendanceTableV2