import { AttendanceColumns } from "@/components/Dummy/contants";

import { useFetchAttendances } from "@/hooks/fetch/useAttendance";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { useRouter } from "next/router";
import { useState } from "react";
import { ISession } from "@/lib/database/models/session.model";
import { IAttendance } from "@/lib/database/models/attendance.model";
import DeleteDialog from "../DeleteDialog";
import { deleteAttendance } from "@/lib/actions/attendance.action";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";
import { attendanceRoles, canPerformAction, memberRoles, sessionRoles } from "../auth/permission/permission";

type AttendanceTableProps = {
    currentSession:ISession
}

const AttendanceTable = ({currentSession}:AttendanceTableProps) => {
    const [currentAttendance, setCurrentAttendance] = useState<IAttendance|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const paginationModel = { page: 0, pageSize: 10 };
    // const router = useRouter();
    const {attendances, loading, refetch} = useFetchAttendances(currentSession?._id);
    const {user} = useAuth();

    if(!currentSession) return null
    const handleDelete = (data:IAttendance)=>{
        setDeleteMode(true);
        setCurrentAttendance(data);
    }

    const handleDeleteAttendance = async()=>{
        try {
            if(currentAttendance){
                const res = await deleteAttendance(currentAttendance?._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting the record', {variant:'error'});
        }
    }

    const message = `You're about to delete this attendance record. Have you thought this through?`;

    if(!user) return;

    const showMember = canPerformAction(user, 'reader', {memberRoles});
    const showSession = canPerformAction(user, 'reader', {sessionRoles});
    const showDelete = canPerformAction(user, 'deleter', {attendanceRoles});

  return (
    <div className="table-main2">
        {/* <div className="flex items-center flex-row justify-between w-full">
            <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
        </div> */}
        <DeleteDialog message={message} onTap={handleDeleteAttendance} value={deleteMode} setValue={setDeleteMode} title="Delete Record" />

        
        <div className="">
            
                <Paper className='' sx={{ height: 'auto', }}>
                    <DataGrid
                        loading={loading}
                        rows={attendances}
                        columns={AttendanceColumns(handleDelete, showMember, showSession, showDelete)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                        getRowId={(row:IAttendance)=>row._id}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:text-blue-800'
                        sx={{ border: 0 }}
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
                </Paper>
            
        </div>
    </div>
  )
}

export default AttendanceTable