'use client'

import DeleteDialog from "@/components/DeleteDialog";
import AddButton from "@/components/features/AddButton";
// import SearchBar from "@/components/features/SearchBar";
import { useEffect, useState } from "react";
import { IActivity } from "@/lib/database/models/activity.model";
// import { ErrorProps } from "@/types/Types";
import { deleteActivity } from "@/lib/actions/activity.action";
import { Paper } from "@mui/material";
import { useFetchActivitiesForMinistry } from "@/hooks/fetch/useActivity";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IClassministry } from "@/lib/database/models/classministry.model";
import ActivityInfoModal from "../../ActivityInfoModal";
import NewActivityDown from "../../new/NewActivityDown";
// import { SearchActivityWithoutChurch } from "../../fxn";
import { ActivityColumns } from "../../ActivityColumns";
import { enqueueSnackbar } from "notistack";
import MinistryroleTable from "./MinistryroleTable";
import { IMinistryrole } from "@/lib/database/models/ministryrole.model";
import { useAuth } from "@/hooks/useAuth";
import { activityRoles, canPerformAction, memberRoles, ministryRoles } from "@/components/auth/permission/permission";
import { useRouter } from "next/navigation";

type SingleMinistryTableProps = {
    currentClassministry:IClassministry
}

const SingleMinistryTable = ({currentClassministry}:SingleMinistryTableProps) => {
  const {user} = useAuth();
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [infoMode, setInfoMode] = useState<boolean>(false);
  const [newMode, setNewMode] = useState<boolean>(false);
  // const [search, setSearch] = useState<string>('');
  const [currentActivity, setCurrentActivity] = useState<IActivity|null>(null);
  // const [response, setResponse] = useState<ErrorProps>(null);
  const [title, setTitle] = useState<string>('Activities');
  const [editMode, setEditMode] = useState<boolean>(false);

  const [currentMinister, setCurrentMinister] = useState<IMinistryrole|null>(null);


  const titles = ['Activities', 'Leaders'];

  const {activities, isPending, refetch} = useFetchActivitiesForMinistry(currentClassministry?._id);
  const router = useRouter();
  // const [deleteMode, setDeleteMode] = useState<boolean>(false);
//   console.log(acts);

  const updater = canPerformAction(user!, 'updater', {ministryRoles});
  const actCreator = canPerformAction(user!, 'creator', {activityRoles});
  const actDeleter = canPerformAction(user!, 'deleter', {activityRoles});
  const actReader = canPerformAction(user!, 'reader', {activityRoles});
  const minReader = canPerformAction(user!, 'reader', {ministryRoles});
  const showMember = canPerformAction(user!, 'reader', {memberRoles});

  useEffect(()=>{
    if(user && !updater){
      router.replace('/dashboard/forbidden?p=Ministry Updater');
    }
  },[user, updater, router])

  const handleDeleteActivity = async()=>{
    try {
      if(currentActivity){
        const res = await deleteActivity(currentActivity?._id);
        enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
        setDeleteMode(false);
        refetch();
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

  const handleNewRoleMode = () =>{
    setEditMode(true);
    setCurrentMinister(null);
  }

  const handleDelete = (data:IActivity)=>{
    setCurrentActivity(data);
    setDeleteMode(true);
  }

  const handleClickTitle = (item:string)=>{
    setTitle(item);
    // setSearch('');
  }

  const message = `You're about to delete this activity. Are you sure?`
  
  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className="table-main2" >
        <div className="flex w-full justify-between">
            <div className="flex items-end gap-4">
                {
                    titles.map((item)=>(
                        <div key={item} onClick={()=>handleClickTitle(item)} className={`flex ${title === item && 'border-b-2 border-blue-500'} cursor-pointer`}>
                            <span className="font-bold" >{item}</span>
                        </div>
                    ))
                }
            </div>
            <div className="flex items-end gap-4">
                {/* <SearchBar setSearch={setSearch} reversed={false} /> */}
                {
                  ((title === 'Activities') && actCreator) ?
                  <AddButton text="Create Activity" onClick={handleNewMode} noIcon smallText className="rounded" type="button" />
                  :
                  <>
                  {
                    updater &&
                    <AddButton text="Create Role" onClick={handleNewRoleMode} noIcon smallText className="rounded" type="button" />
                  }
                  </>
                }
            </div>
        </div>
    <DeleteDialog message={message} onTap={handleDeleteActivity} title={`Remove ${currentActivity?.name}`} value={deleteMode} setValue={setDeleteMode} />
    <ActivityInfoModal setCurrentActivity={setCurrentActivity} infoMode={infoMode} currentActivity={currentActivity} setInfoMode={setInfoMode} />
    <NewActivityDown mininstryId={currentClassministry?._id} newMode={newMode} setNewMode={setNewMode} activity={currentActivity} />
    {/* {
        response?.message &&
        <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
    } */}
    {
      title === 'Activities' ?
      <div className="flex w-full">
        <Paper className='w-full' sx={{ height: 480, }}>
            <DataGrid
                rows={activities}
                getRowId={(row:IActivity)=>row._id}
                columns={ActivityColumns(handleDelete,  handleInfo, actReader, actDeleter, minReader)}
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
      </div>
      :
      <MinistryroleTable 
        currentMinister={currentMinister}
        ministry={currentClassministry}
        setCurrentMinister={setCurrentMinister} 
        // search={search}
        showMember={showMember} 
        editMode={editMode} setEditMode={setEditMode}
      />
    }
</div>
  )
}

export default SingleMinistryTable