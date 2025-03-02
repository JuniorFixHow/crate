'use client'

import {  useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import SearchBar from "@/components/features/SearchBar";
import AddButton from "@/components/features/AddButton";
import DeleteDialog from "@/components/DeleteDialog";
import { IFacility } from "@/lib/database/models/facility.model";
// import { ErrorProps } from "@/types/Types";
import { useFetchFacilities } from "@/hooks/fetch/useFacility";
import { deleteFacility, getFacility } from "@/lib/actions/facility.action";
// import SearchSelectZones from "@/components/features/SearchSelectZones";
// import SearchSelectChurchForRoomAss from "@/components/features/SearchSelectChurchForRoomAss";
import {  SearchFacilityWithChurchV2 } from "./fxn";
import { FacilityColumns } from "./FacilityColumns";
import NewSingleFacility from "./NewFacility";
import FacilityInfoModal from "./FacilityModal";
import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import SearchSelectChurchesV2 from "@/components/features/SearchSelectChurchesV2";
import { useAuth } from "@/hooks/useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";



const FacilityTable = () => {
    const [currentFacility, setCurrentFacility] = useState<IFacility|null>(null);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    // const [search, setSearch] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    // const [zoneId, setZoneId] = useState<string>('');
    // const [response, setReponse] = useState<ErrorProps>(null);

    const {facilities, loading, refetch} = useFetchFacilities();

    const searchParams = useSearchParams();

   const {user} = useAuth();
   const isAdmin = checkIfAdmin(user);
  

    const paginationModel = { page: 0, pageSize: 10 };

    const handleNewFacility = (data:IFacility)=>{
        setCurrentFacility(data);
        setNewMode(true);
    }

    const handleDelete = (data:IFacility)=>{
        setCurrentFacility(data);
        setDeleteMode(true);
    }

    const hadndleInfo = (data:IFacility)=>{
        setCurrentFacility(data);
        setInfoMode(true);
    }

    const handleDeleteFacility = async()=>{
        try {
            if(currentFacility){
                const res = await deleteFacility(currentFacility._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing facility', {variant:'error'});
        }
    }

    useEffect(()=>{
        const id = searchParams.get('id')
        const fetchFacility = async()=>{
            if(id){
                try {
                    const fac = await getFacility(id);
                    setCurrentFacility(fac);
                    setInfoMode(true);
                } catch (error) {
                    console.log(error);
                    enqueueSnackbar('Error occured removing facility data', {variant:'error'});
                }
            }
        }
        fetchFacility()
    },[searchParams])

    const handleOpenNew = () =>{
        setNewMode(true);
        setCurrentFacility(null);
    }

    const message = `You're about to delete a facility. This will delete rooms and keys depending on it`;
    if(!user) return null;
    return (
      <div className='table-main2' >
           
           <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row items-end gap-4">
                    {
                        isAdmin &&
                        <SearchSelectChurchesV2 setSelect={setChurchId} />
                    }
                </div>
                <div className="flex flex-row gap-4 justify-end items-center px-0 lg:px-4">
                    {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
                    <AddButton onClick={handleOpenNew} smallText text='Add Facility' noIcon className='rounded py-2' />
                </div>
           </div>
          <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete room ${currentFacility?.name}`} message={message} onTap={handleDeleteFacility} />
          <FacilityInfoModal currentFacility={currentFacility} setCurrentFacility={setCurrentFacility} infoMode={infoMode} setInfoMode={setInfoMode} />
          <NewSingleFacility currentFacility={currentFacility} setCurrentFacility={setCurrentFacility} infoMode={newMode} setInfoMode={setNewMode} />
  
            {/* {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
            } */}
          <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={SearchFacilityWithChurchV2(facilities,  churchId)}
                    columns={FacilityColumns(hadndleInfo, handleNewFacility, handleDelete)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                    getRowId={(row:IFacility):string=>row._id}
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
                        },
                        showQuickFilter:true
                    }}}
                />
            </Paper>
          </div>
  
      </div>
    )
}

export default FacilityTable