'use client'
import { useEffect, useState } from "react"
import ArrivalTop from "./ArrivalTop"
// import ArrivalSearch from "./ArrivalSearch";
import AddButton from "@/components/features/AddButton";
import { Alert,  Paper } from "@mui/material";
import { ErrorProps } from "@/types/Types";
import { IRegistration } from "@/lib/database/models/registration.model";
import DeleteDialog from "@/components/DeleteDialog";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useFetchCheckedInRegistrations } from "@/hooks/fetch/useRegistration";
import { useFetchEvents } from "@/hooks/fetch/useEvent";
// import { SearchCheckedReg } from "./fxn";
import { ArrivalColumns } from "./ArrivalColumns";
import Link from "next/link";
import ArrivalInfoModal from "./ArrivalInfoModal";
import { updateReg } from "@/lib/actions/registration.action";
import { useAuth } from "@/hooks/useAuth";
import { enqueueSnackbar } from "notistack";
import { campusRoles, canPerformAction, eventRegistrationRoles, isSuperUser, isSystemAdmin, memberRoles } from "@/components/auth/permission/permission";
import { useRouter } from "next/navigation";

const ArrivalTable = () => {
    const {user} = useAuth();
    const [eventId, setEventId] = useState<string>('');

    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentRegistration, setCurrentRegistration] = useState<IRegistration|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const router = useRouter();

    // console.log(date);
    const {events} = useFetchEvents();
    const {checkRegistrations, refetch, loading} = useFetchCheckedInRegistrations(eventId);

    const reader = canPerformAction(user!, 'reader', {eventRegistrationRoles});
    const updater = canPerformAction(user!, 'updater', {eventRegistrationRoles});
    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const showChurch = isSuperUser(user!) || isSystemAdmin.reader(user!);
    const showCampus = canPerformAction(user!, 'reader', {campusRoles});

    useEffect(()=>{
      if(user && (!reader && !updater)){
        router.replace('/dashboard/forbidden?p=Event Registration Reader')
      }
    },[reader, updater, user, router])

    const handleInfo = (data:IRegistration)=>{
      setInfoMode(true);
      setCurrentRegistration(data);
    }
    const handleDelete = (data:IRegistration)=>{
      setDeleteMode(true);
      setCurrentRegistration(data);
    }

    useEffect(()=>{
      setEventId(events[0]?._id);
    },[events])

    const handleDeleteArrival = async()=>{
      try {
        const body:Partial<IRegistration> = {
          ...currentRegistration,
          checkedIn:{
            date:'',
            checked:false
          }
        }
        if(currentRegistration){
          const res = await updateReg(currentRegistration?._id, body);
          refetch();
          enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
          setDeleteMode(false);
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured deleting arrival record', {variant:'error'});
      }
    }

    const message = `You're about to delete an arrival record. This will not affect the registration data of the member. Continue?`

    const paginationModel = { page: 0, pageSize: 15 };
    if(!reader && !updater) return;
  return (
    <div className="table-main2" >
        <ArrivalTop eventId={eventId} setEventId={setEventId} />

        <div className="flex items-start gap-4 justify-end">
          {/* <ArrivalSearch setDate={setDate} setSearch={setSearch} /> */}
          {
            updater &&
            <Link href={'/dashboard/events/arrivals/new'} >
              <AddButton text="New Arrival" noIcon smallText className="rounded" />
            </Link>
          }
        </div>


        <DeleteDialog onTap={handleDeleteArrival} message={message} title={`Delete record`} value={deleteMode} setValue={setDeleteMode} />
        <ArrivalInfoModal infoMode={infoMode} setInfoMode={setInfoMode} setCurrentEventReg={setCurrentRegistration} currentEventReg={currentRegistration} />

        {
          response?.message &&
          <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }
        <div className="flex w-full">
          <Paper className='w-full' sx={{ height: 'auto', }}>
              <DataGrid
                  getRowId={(row:IRegistration):string=> row?._id as string}
                  rows={checkRegistrations}
                  columns={ArrivalColumns(handleInfo, handleDelete, reader, updater, showMember, showChurch, showCampus)}
                  initialState={{ 
                    pagination: { paginationModel },
                    columns:{
                      columnVisibilityModel:{
                          email:false,
                          ageRange:false,
                          gender:false,
                          phone:false,
                          mstatus:false,
                          marital:false,
                          employ:false,
                          voice:false,
                          role:false,
                          church:false,
                          campus:false,
                          createdAt:false,
                      }
                  } 
                  }}
                  pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                  // checkboxSelection
                  className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                  sx={{ border: 0 }}
                  loading={loading}
                  slots={{toolbar:GridToolbar}}
                  slotProps={{
                    toolbar:{
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

export default ArrivalTable