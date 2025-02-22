import SearchBar from "@/components/features/SearchBar";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import { useRouter } from "next/router";
import { useState } from "react";

import { ErrorProps } from "@/types/Types";
import { IClasssession } from "@/lib/database/models/classsession.model";
import { ICAttendance } from "@/lib/database/models/classattendance.model";
import { deleteCAttendance } from "@/lib/actions/cattendance.action";
import { enqueueSnackbar } from "notistack";
import DeleteDialog from "@/components/DeleteDialog";
import { AttendanceColumnsV2 } from "./AttendanceColumnsV2";
import { searchAttenanceV2 } from "./fxn";
import { useFetchCAttendances } from "@/hooks/fetch/useCAttendance";

type AttendanceTableV2Props = {
    currentSession:IClasssession
}

const AttendanceTableV2 = ({currentSession}:AttendanceTableV2Props) => {
    const [search, setSearch] = useState<string>('');
    const [currentAttendance, setCurrentAttendance] = useState<ICAttendance|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [deleteState, setDeleteState] = useState<ErrorProps>(null);

    const paginationModel = { page: 0, pageSize: 10 };
    // const router = useRouter();
    const {attendances, isPending} = useFetchCAttendances(currentSession?._id);

    if(!currentSession) return null
    const handleDelete = (data:ICAttendance)=>{
        setDeleteMode(true);
        setCurrentAttendance(data);
    }

    const handleDeleteAttendance = async()=>{
        try {
            if(currentAttendance){
                await deleteCAttendance(currentAttendance?._id);
                enqueueSnackbar('Record deleted successfully', {variant:'success'});
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting the record', {variant:'error'});
        }
    }

    const message = `You're about to delete this attendance record. Have you thought this through?`

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border dark:bg-[#0F1214] rounded">
        <div className="flex items-center flex-row justify-between w-full">
            <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
        </div>
        <DeleteDialog message={message} onTap={handleDeleteAttendance} value={deleteMode} setValue={setDeleteMode} title="Delete Record" />

        {
            deleteState?.message &&
            <Alert onClose={()=>setDeleteState(null)} severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
        }
        <div className="table-main">
            {
                isPending ?
                <LinearProgress className="w-full" />
                :
                <Paper className='' sx={{ height: 480, }}>
                    <DataGrid
                        rows={searchAttenanceV2(search, attendances as ICAttendance[])}
                        columns={AttendanceColumnsV2(handleDelete)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                        getRowId={(row:ICAttendance)=>row._id}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:text-blue-800'
                        sx={{ border: 0 }}
                    />
                </Paper>
            }
        </div>
    </div>
  )
}

export default AttendanceTableV2