'use client'

import DeleteDialog from "@/components/DeleteDialog";
import AddButton from "@/components/features/AddButton";
import SearchBar from "@/components/features/SearchBar";
import SearchSelectChurch from "@/components/shared/SearchSelectChurch";
import { useState } from "react";
import { IActivity } from "@/lib/database/models/activity.model";
import { ErrorProps } from "@/types/Types";
import { deleteActivity } from "@/lib/actions/activity.action";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { useFetchActivities } from "@/hooks/fetch/useActivity";
import { DataGrid } from "@mui/x-data-grid";
import { IClassministry } from "@/lib/database/models/classministry.model";
import ActivityInfoModal from "../../ActivityInfoModal";
import NewActivityDown from "../../new/NewActivityDown";
import { SearchActivityWithChurch } from "../../fxn";
import { ActivityColumns } from "../../ActivityColumns";
import { enqueueSnackbar } from "notistack";

type SingleMinistryTableProps = {
    currentClassministry:IClassministry
}

const SingleMinistryTable = ({currentClassministry}:SingleMinistryTableProps) => {
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [infoMode, setInfoMode] = useState<boolean>(false);
  const [newMode, setNewMode] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [churchId, setChurchId] = useState<string>('');
  const [currentActivity, setCurrentActivity] = useState<IActivity|null>(null);
  const [response, setResponse] = useState<ErrorProps>(null);

  const {acts, inprogress, refresh} = useFetchActivities(undefined, currentClassministry?._id);
  // const [deleteMode, setDeleteMode] = useState<boolean>(false);
//   console.log(acts);

  const handleDeleteActivity = async()=>{
    try {
      if(currentActivity){
        const res = await deleteActivity(currentActivity?._id);
        enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
        setDeleteMode(false);
        refresh();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error occured deleting the activity', {variant:'error'});
    }
  }

  const handleInfo = (data:IActivity)=>{
    setCurrentActivity(data);
    setInfoMode(true);
  }

  const handleNewMode = () =>{
    setNewMode(true);
    setCurrentActivity(null);
  }

  const handleDelete = (data:IActivity)=>{
    setCurrentActivity(data);
    setDeleteMode(true);
  }

  const message = `You're about to delete this activity. Are you sure?`
  
  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className="flex flex-col p-5 rounded gap-4 bg-white dark:bg-transparent dark:border" >
        <div className="flex w-full justify-between">
            <div className="flex items-end gap-4">
                <SearchSelectChurch setSelect={setChurchId} isGeneric />
            </div>
            <div className="flex items-end gap-4">
                <SearchBar setSearch={setSearch} reversed={false} />
                <AddButton text="Create Activity" onClick={handleNewMode} noIcon smallText className="rounded" type="button" />
            </div>
        </div>
    <DeleteDialog message={message} onTap={handleDeleteActivity} title={`Remove ${currentActivity?.name}`} value={deleteMode} setValue={setDeleteMode} />
    <ActivityInfoModal setCurrentActivity={setCurrentActivity} infoMode={infoMode} currentActivity={currentActivity} setInfoMode={setInfoMode} />
    <NewActivityDown mininstryId={currentClassministry?._id} newMode={newMode} setNewMode={setNewMode} activity={currentActivity} />
    {
        response?.message &&
        <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
    }
    <div className="flex w-full">
        {
            inprogress ? 
            <LinearProgress className="w-full" />
            :
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={SearchActivityWithChurch(acts as IActivity[], search, churchId)}
                    getRowId={(row:IActivity)=>row._id}
                    columns={ActivityColumns(handleDelete,  handleInfo)}
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

export default SingleMinistryTable