'use client'
import DeleteDialog from "@/components/DeleteDialog"
import AddButton from "@/components/features/AddButton";
import SearchBar from "@/components/features/SearchBar";
import { useFetchVenues } from "@/hooks/fetch/useVenue";
import { deleteVenue } from "@/lib/actions/venue.action";
import { IVenue } from "@/lib/database/models/venue.model";
import { ErrorProps } from "@/types/Types";
import { Alert, LinearProgress, Paper } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useState } from "react";
import { VenueColumns } from "./VenueColumns";
import Link from "next/link";
import SearchSelectZones from "@/components/features/SearchSelectZones";
import SearchSelectChurchForRoomAss from "@/components/features/SearchSelectChurchForRoomAss";
import { SearchVenueWithchurch } from "./fxn";
import VenueInfoModal from "./VenueInfoModal";

const VenueTable = () => {
    const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentVenue, setCurrentVenue] = useState<IVenue|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [zoneId, setZoneId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');

    const {venues, loading} = useFetchVenues();

    const handleDeleteMode = (data:IVenue)=>{
        setDeleteMode(true);
        setCurrentVenue(data);
    }
    const handleInfoMode = (data:IVenue)=>{
        setInfoMode(true);
        setCurrentVenue(data);
    }

    const handledeleteVenue = async()=>{
        try {
            if(currentVenue){
                const res = await deleteVenue(currentVenue?._id);
                setResponse(res);
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured. Please retry', error:true})
        }
    }

    const message = `You're about to delete a venue. This will delete facilties, rooms and keys depending on it`;
    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded' >

        <div className="flex flex-col gap-3">
            <div className="flex flex-col md:items-end gap-4 md:flex-row">
                <SearchSelectZones isGeneric setSelect={setZoneId} />
                <SearchSelectChurchForRoomAss isGeneric zoneId={zoneId} setSelect={setChurchId} />
            </div>
            <div className="flex flex-row gap-4  items-center px-0  w-full justify-end">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <Link href={`/dashboard/venues/new`} >
                    <AddButton smallText text='Add Venue' noIcon className='rounded' />
                </Link>
            </div>
        </div>


        {/* <NewService infoMode={editmode} setInfoMode={setEditmode} setCurrentService={setCurrentService} currentService={currentService} /> */}
        <VenueInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentVenue={currentVenue} setCurrentVenue={setCurrentVenue} />
        <DeleteDialog onTap={handledeleteVenue} message={message} title={`Delete ${currentVenue?.name}`} value={deleteMode} setValue={setDeleteMode} />

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
                    getRowId={(row:IVenue):string=> row?._id as string}
                    rows={SearchVenueWithchurch(venues, search, churchId)}
                    columns={VenueColumns(handleInfoMode, handleDeleteMode)}
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

export default VenueTable