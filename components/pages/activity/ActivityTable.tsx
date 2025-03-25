'use client'

import DeleteDialog from "@/components/DeleteDialog";
import AddButton from "@/components/features/AddButton";
// import SearchSelectChurch from "@/components/shared/SearchSelectChurch";
import { useEffect,  useState } from "react";
import ActivityInfoModal from "./ActivityInfoModal";
import { IActivity } from "@/lib/database/models/activity.model";
import { ErrorProps } from "@/types/Types";
import { deleteActivity } from "@/lib/actions/activity.action";
import { Alert, Paper } from "@mui/material";
import { useFetchActivities } from "@/hooks/fetch/useActivity";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ActivityColumns } from "./ActivityColumns";
import { SearchActivityWithChurch } from "./fxn";
import NewActivityDown from "./new/NewActivityDown";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";
import { activityRoles, canPerformAction, isSuperUser, isSystemAdmin, ministryRoles } from "@/components/auth/permission/permission";
import SearchSelectChurchesV3 from "@/components/features/SearchSelectChurchesV3";
import { useRouter } from "next/navigation";

const ActivityTable = () => {
  const {user} = useAuth();
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [infoMode, setInfoMode] = useState<boolean>(false);
  const [newMode, setNewMode] = useState<boolean>(false);
  // const [search, setSearch] = useState<string>('');
  const [churchId, setChurchId] = useState<string>('');
  const [currentActivity, setCurrentActivity] = useState<IActivity|null>(null);
  const [response, setResponse] = useState<ErrorProps>(null);

  const {activities, loading, refetch} = useFetchActivities();

  const actDeleter = canPerformAction(user!, 'deleter', {activityRoles});
  const actReader = canPerformAction(user!, 'reader', {activityRoles});
  const minReader = canPerformAction(user!, 'reader', {ministryRoles});
  const actCreator = canPerformAction(user!, 'creator', {activityRoles});
  const admin = canPerformAction(user!, 'admin', {activityRoles});
  const isAdmin = isSuperUser(user!) || isSystemAdmin.reader(user!);

  const router = useRouter();
  // const [deleteMode, setDeleteMode] = useState<boolean>(false);

  useEffect(() => {
    if (user && !admin) {
      router.replace("/dashboard/forbidden?p=Activity Admin");
    }
  }, [user, admin, router]);

  const handleDeleteActivity = async()=>{
    try {
      if(currentActivity){
        const res = await deleteActivity(currentActivity?._id);
        setDeleteMode(false);
        enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
        refetch();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error occured deleting the activity',{variant:'error'})
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
  if(!admin) return;
  return (
    <div className="table-main2" >
        <div className="flex w-full justify-between">
            <div className="flex items-end gap-4">
              {
                isAdmin &&
                <SearchSelectChurchesV3 setSelect={setChurchId} />
              }
            </div>
            <div className="flex items-end gap-4">
                {/* <SearchBar setSearch={setSearch} reversed={false} /> */}
                {
                  actCreator &&
                  <AddButton text="Create Activity" onClick={handleNewMode} noIcon smallText className="rounded" type="button" />
                }
            </div>
        </div>
    <DeleteDialog message={message} onTap={handleDeleteActivity} title={`Remove ${currentActivity?.name}`} value={deleteMode} setValue={setDeleteMode} />
    <ActivityInfoModal setCurrentActivity={setCurrentActivity} infoMode={infoMode} currentActivity={currentActivity} setInfoMode={setInfoMode} />
    <NewActivityDown showMinistries newMode={newMode} setNewMode={setNewMode} activity={currentActivity} />
    {
        response?.message &&
        <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
    }
    <div className="flex w-full">
      <Paper className='w-full' sx={{ height: 'auto', }}>
          <DataGrid
              rows={SearchActivityWithChurch(activities, churchId)}
              getRowId={(row:IActivity)=>row._id}
              columns={ActivityColumns(handleDelete,  handleInfo, actReader, actDeleter, minReader)}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10, 15, 20, 30, 50]}
              loading={loading}
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
  </div>
  )
}

export default ActivityTable