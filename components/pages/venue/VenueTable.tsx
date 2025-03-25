'use client'
import DeleteDialog from "@/components/DeleteDialog"
import AddButton from "@/components/features/AddButton";
// import SearchBar from "@/components/features/SearchBar";
import { useFetchVenues } from "@/hooks/fetch/useVenue";
import { deleteVenue } from "@/lib/actions/venue.action";
import { IVenue } from "@/lib/database/models/venue.model";
import {  Paper } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useEffect, useState } from "react";
import { VenueColumns } from "./VenueColumns";
import Link from "next/link";
import {  SearchVenueWithchurchV2 } from "./fxn";
import VenueInfoModal from "./VenueInfoModal";
import SearchSelectChurchesV2 from "@/components/features/SearchSelectChurchesV2";
import { useAuth } from "@/hooks/useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { enqueueSnackbar } from "notistack";
import { canPerformAction, facilityRoles, venueRoles } from "@/components/auth/permission/permission";
import { useRouter } from "next/navigation";

const VenueTable = () => {
    // const [search, setSearch] = useState<string>('');
    // const [response, setResponse] = useState<ErrorProps>(null);
    const [currentVenue, setCurrentVenue] = useState<IVenue|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [zoneId, setZoneId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');

    const {venues, loading, refetch} = useFetchVenues();
    const router = useRouter();

    const {user} = useAuth();

    const isAdmin = checkIfAdmin(user);
    const creator = canPerformAction(user!, 'creator', {venueRoles});
    const reader = canPerformAction(user!, 'reader', {venueRoles});
    const updater = canPerformAction(user!, 'updater', {venueRoles});
    const deleter = canPerformAction(user!, 'deleter', {venueRoles});
    const admin = canPerformAction(user!, 'admin', {venueRoles});
    const facReader = canPerformAction(user!, 'reader', {facilityRoles});

    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Venue Admin');
        }
    },[admin, user, router])


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
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured. Please retry', {variant:'error'});
        }
    }

    const message = `You're about to delete a venue. This will delete facilties, rooms and keys depending on it`;
    const paginationModel = { page: 0, pageSize: 10 };

    if(!admin) return;
  return (
    <div className='table-main2' >

        <div className="flex flex-col gap-3">
            <div className="flex flex-col md:items-end gap-4 md:flex-row">
                {
                    isAdmin &&
                    <SearchSelectChurchesV2 setSelect={setChurchId}/>
                }
            </div>
            {
                creator &&
                <div className="flex flex-row gap-4  items-center px-0  w-full md:justify-end">
                    {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
                    <Link href={`/dashboard/venues/new`} >
                        <AddButton smallText text='Add Venue' noIcon className='rounded' />
                    </Link>
                </div>
            }
        </div>


        {/* <NewService infoMode={editmode} setInfoMode={setEditmode} setCurrentService={setCurrentService} currentService={currentService} /> */}
        <VenueInfoModal facReader={facReader} reader={reader||updater} infoMode={infoMode} setInfoMode={setInfoMode} currentVenue={currentVenue} setCurrentVenue={setCurrentVenue} />
        <DeleteDialog onTap={handledeleteVenue} message={message} title={`Delete ${currentVenue?.name}`} value={deleteMode} setValue={setDeleteMode} />

        {/* {
          response?.message &&
          <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        } */}
        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    loading={loading}
                    getRowId={(row:IVenue):string=> row?._id as string}
                    rows={SearchVenueWithchurchV2(venues,  churchId)}
                    columns={VenueColumns(handleInfoMode, handleDeleteMode, reader, updater, deleter, facReader)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                    slots={{toolbar:GridToolbar}}
                    slotProps={{
                        toolbar:{
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true
                            },
                            showQuickFilter:true
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

export default VenueTable