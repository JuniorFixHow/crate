import { useFetchMinistryroleforMinistry } from "@/hooks/fetch/useMinistryrole";
import { IClassministry } from "@/lib/database/models/classministry.model";
import { IMinistryrole } from "@/lib/database/models/ministryrole.model";
import {  Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { SearchMinistryrole } from "./fxn";
import { MinistryroleColumns } from "./MinistryroleColumns";
import { Dispatch, SetStateAction, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { deleteMinistryrole } from "@/lib/actions/ministryrole.action";
import DeleteDialog from "@/components/DeleteDialog";
import NewMinistryrole from "./NewMinistryrole";

type MinistryroleTableProps = {
    ministry:IClassministry,
    // search:string,
    currentMinister:IMinistryrole|null,
    setCurrentMinister:Dispatch<SetStateAction<IMinistryrole|null>>,
    setEditMode:Dispatch<SetStateAction<boolean>>,
    editMode:boolean,
    showMember:boolean,
}

const MinistryroleTable = ({ministry, showMember, currentMinister, editMode, setEditMode, setCurrentMinister}
    :MinistryroleTableProps) => {
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const {ministryroles, isPending, refetch} = useFetchMinistryroleforMinistry(ministry?._id);

    const handleDelete = (data:IMinistryrole)=>{
        setDeleteMode(true);
        setCurrentMinister(data);
    }

    const handleEdit = (data:IMinistryrole)=>{
        setEditMode(true);
        setCurrentMinister(data);
    }
    const handleDeleteRole = async()=>{
        try {
            if(currentMinister){
                const res =  await deleteMinistryrole(currentMinister?._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                refetch()
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting role', {variant:'error'});
        }
    }

    const message = `You're about to delete a role for this ministry. Are you aware?`

    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <>
        <NewMinistryrole 
            infoMode={editMode} setInfoMode={setEditMode}
            currentMinister={currentMinister} setCurrentMinister={setCurrentMinister}
            minId={ministry?._id} 
        />
        <DeleteDialog
            setValue={setDeleteMode}
            value={deleteMode}
            message={message} title={`Delete ${currentMinister?.title}`}
            onTap={handleDeleteRole}
        />
        <div className="flex w-full">
        {
            // isPending ? 
            // <LinearProgress className="w-full" />
            // :
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={ministryroles}
                    getRowId={(row:IMinistryrole)=>row._id}
                    columns={MinistryroleColumns(handleEdit, handleDelete, showMember)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50]}
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
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                    />
            </Paper>
        }
        </div>
    </>
  )
}

export default MinistryroleTable