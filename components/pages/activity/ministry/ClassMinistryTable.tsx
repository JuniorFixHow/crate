'use client'

import DeleteDialog from "@/components/DeleteDialog";
import AddButton from "@/components/features/AddButton";
import SearchBar from "@/components/features/SearchBar";
import SearchSelectChurch from "@/components/shared/SearchSelectChurch";
import { IClassministry } from "@/lib/database/models/classministry.model";
import { ErrorProps } from "@/types/Types";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRef, useState } from "react"
import { SearchClassministry } from "./fxn";
import { ClassMinistryColumns } from "./ClassMinistryColumns";
import { deleteClassministry } from "@/lib/actions/classministry.action";
import { enqueueSnackbar } from "notistack";
import { useFetchClassministry } from "@/hooks/fetch/useClassministry";
import NewClassMinistry from "./NewClassMinistry";

const ClassMinistryTable = () => {
    const [search, setSearch] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentMinistry, setCurrentMinistry] = useState<IClassministry|null>(null);

    const {classMinistries, isPending, refetch} = useFetchClassministry();

    const tableRef = useRef<HTMLDivElement>(null);

    const handleNewMode = ()=>{
        setNewMode(true);
        setCurrentMinistry(null);
    }

    const handleDeleteMode = (data:IClassministry)=>{
        setDeleteMode(true);
        setCurrentMinistry(data);
    }

    const handleEditMode = (data:IClassministry)=>{
        setNewMode(true);
        setCurrentMinistry(data);
    }

    const handleDeleteMinistry = async()=>{
        try {
            if(currentMinistry){
                const response = await deleteClassministry(currentMinistry._id);
                enqueueSnackbar(response?.message, {variant:'success'});
                setDeleteMode(false);
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting ministry', {variant:'error'})
        }
    }

    const message = `Deleting the entire ministy will also delete its activities and attendance records.`

    const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div ref={tableRef}  className="flex relative flex-col p-5 rounded gap-4 bg-white dark:bg-transparent dark:border" >
        <div className="flex w-full justify-between">
            <div className="flex items-end gap-4">
                <SearchSelectChurch setSelect={setChurchId} isGeneric />
            </div>
            <div className="flex items-end gap-4">
                <SearchBar setSearch={setSearch} reversed={false} />
                {
                    !newMode &&
                    <AddButton text="Create Ministry" onClick={handleNewMode} noIcon smallText className="rounded" type="button" />
                }
            </div>
        </div>
        <NewClassMinistry
            newMode={newMode}
            setNewMode={setNewMode}
            currentClassministry={currentMinistry!}
            inputRef={tableRef}
        />
        <DeleteDialog message={message} onTap={handleDeleteMinistry} title={`Remove ${currentMinistry?.title}`} value={deleteMode} setValue={setDeleteMode} />
        {/* <ActivityInfoModal setCurrentActivity={setCurrentActivity} infoMode={infoMode} currentActivity={currentActivity} setInfoMode={setInfoMode} />
        <NewActivityDown newMode={newMode} setNewMode={setNewMode} activity={currentActivity} /> */}
        {
            response?.message &&
            <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }
        <div className="flex w-full">
            {
                isPending ? 
                <LinearProgress className="w-full" />
                :
                <Paper className='w-full' sx={{ height: 480, }}>
                    <DataGrid
                        rows={SearchClassministry(classMinistries as IClassministry[], search, churchId)}
                        getRowId={(row:IClassministry)=>row._id}
                        columns={ClassMinistryColumns(handleDeleteMode,  handleEditMode)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                    />
                </Paper>
            }
        </div>
</div>
  )
}

export default ClassMinistryTable