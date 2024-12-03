import { AttendanceColumns } from "@/components/Dummy/contants";
import SearchBar from "@/components/features/SearchBar";
import { searchAttenance } from "@/functions/search";
import { useFetchAttendances } from "@/hooks/fetch/useAttendance";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import { useRouter } from "next/router";
import { useState } from "react";
import { ISession } from "@/lib/database/models/session.model";
import { IAttendance } from "@/lib/database/models/attendance.model";
import DeleteDialog from "../DeleteDialog";
import { deleteAttendance } from "@/lib/actions/attendance.action";
import { ErrorProps } from "@/types/Types";

type AttendanceTableProps = {
    currentSession:ISession
}

const AttendanceTable = ({currentSession}:AttendanceTableProps) => {
    const [search, setSearch] = useState<string>('');
    const [currentAttendance, setCurrentAttendance] = useState<IAttendance|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [deleteState, setDeleteState] = useState<ErrorProps>(null);

    const paginationModel = { page: 0, pageSize: 10 };
    // const router = useRouter();
    const {attendances, loading} = useFetchAttendances(currentSession?._id);

    if(!currentSession) return null
    const handleDelete = (data:IAttendance)=>{
        setDeleteMode(true);
        setCurrentAttendance(data);
    }

    const handleDeleteAttendance = async()=>{
        try {
            if(currentAttendance){
                await deleteAttendance(currentAttendance?._id);
                setDeleteState({message:'Record deleted successfully', error:false});
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            setDeleteState({message:'Error occured deleting the record', error:true})
        }
    }

    const message = `You're about to delete this attendance record. Have you thought this through?`

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border dark:bg-black rounded">
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
                loading ?
                <LinearProgress className="w-full" />
                :
                <Paper className='' sx={{ height: 480, }}>
                    <DataGrid
                        rows={searchAttenance(search, attendances)}
                        columns={AttendanceColumns(handleDelete)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        getRowId={(row:IAttendance)=>row._id}
                        // checkboxSelection
                        className='dark:bg-black dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                    />
                </Paper>
            }
        </div>
    </div>
  )
}

export default AttendanceTable