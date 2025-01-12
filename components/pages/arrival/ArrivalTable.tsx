'use client'
import { useEffect, useState } from "react"
import ArrivalTop from "./ArrivalTop"
import ArrivalSearch from "./ArrivalSearch";
import AddButton from "@/components/features/AddButton";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { ErrorProps } from "@/types/Types";
import { IRegistration } from "@/lib/database/models/registration.model";
import DeleteDialog from "@/components/DeleteDialog";
import { DataGrid } from "@mui/x-data-grid";
import { useFetchCheckedInRegistrations } from "@/hooks/fetch/useRegistration";
import { useFetchEvents } from "@/hooks/fetch/useEvent";
import { SearchCheckedReg } from "./fxn";
import { ArrivalColumns } from "./ArrivalColumns";
import Link from "next/link";
import ArrivalInfoModal from "./ArrivalInfoModal";
import { updateReg } from "@/lib/actions/registration.action";

const ArrivalTable = () => {
    const [eventId, setEventId] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [search, setSearch] = useState<string>('');

    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentRegistration, setCurrentRegistration] = useState<IRegistration|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    // console.log(date);
    const {events} = useFetchEvents();
    const {checkRegistrations, loading} = useFetchCheckedInRegistrations(eventId);

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
          setResponse(res);
          setDeleteMode(false);
        }
      } catch (error) {
        console.log(error);
        setResponse({message:'Error occured deleting arrival record', error:true});
      }
    }

    const message = `You're about to delete an arrival record. This will not affect the registration data of the member. Continue?`

    const paginationModel = { page: 0, pageSize: 15 };
  return (
    <div className="shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded" >
        <ArrivalTop eventId={eventId} setEventId={setEventId} />

        <div className="flex items-start gap-4 justify-end">
          <ArrivalSearch setDate={setDate} setSearch={setSearch} />
          <Link href={'/dashboard/events/arrivals/new'} >
            <AddButton text="New Arrival" noIcon smallText className="rounded" />
          </Link>
        </div>


        <DeleteDialog onTap={handleDeleteArrival} message={message} title={`Delete record`} value={deleteMode} setValue={setDeleteMode} />
        <ArrivalInfoModal infoMode={infoMode} setInfoMode={setInfoMode} setCurrentEventReg={setCurrentRegistration} currentEventReg={currentRegistration} />

        {
          response?.message &&
          <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }
        <div className="flex w-full">
          {
            loading ?
            <LinearProgress className='w-full' />
            :
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    getRowId={(row:IRegistration):string=> row?._id as string}
                    rows={SearchCheckedReg(checkRegistrations, search, date)}
                    columns={ArrivalColumns(handleInfo, handleDelete)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
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

export default ArrivalTable