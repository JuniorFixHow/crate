'use client'
import DeleteDialog from "@/components/DeleteDialog"
import AddButton from "@/components/features/AddButton";
// import SearchBar from "@/components/features/SearchBar";
// import { ErrorProps } from "@/types/Types";
import {   Paper } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useState } from "react";
import { deleteFacility } from "@/lib/actions/facility.action";
import { IFacility } from "@/lib/database/models/facility.model";
import { SingleFacilityColumns } from "./SingleFacilityColumns";
import NewSingleFacility from "./NewSingleFacility";
// import { SearchFacility } from "./fxn";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";
import { canPerformAction, canPerformEvent, eventOrganizerRoles, facilityRoles, isSuperUser, isSystemAdmin } from "@/components/auth/permission/permission";

type SingleFacilityTableProps ={
    facilities:IFacility[],
    venueId:string,
    mine?:boolean
}

const SingleFacilityTable = ({facilities, mine, venueId}:SingleFacilityTableProps) => {
    const {user} = useAuth();

    const [currentFacility, setCurrentFacility] = useState<IFacility|null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const sorted = facilities && facilities?.sort((a, b)=> new Date(a.createdAt) < new Date(b.createdAt) ? 1:-1)

    // const mine = user?.churchId === currentFacility?.churchId.toString();

    const isAdmin = isSystemAdmin.updater(user!) || isSuperUser(user!);

    const orgUpdater = canPerformEvent(user!, 'updater', {eventOrganizerRoles});
    const orgDeleter = canPerformEvent(user!, 'deleter', {eventOrganizerRoles});
    const orgCreator = canPerformEvent(user!, 'creator', {eventOrganizerRoles});
    

    const creator = canPerformAction(user!, 'creator', {facilityRoles});
    const updater = canPerformAction(user!, 'updater', {facilityRoles});
    const deleter = canPerformAction(user!, 'deleter', {facilityRoles});

    const canCreate = (creator && mine) || (orgCreator && mine) || isAdmin;
    const canUpdate = (updater && mine) || (orgUpdater && mine) || isAdmin;
    const canDelete = (deleter && mine) || (orgDeleter && mine) || isAdmin;


    const handleDeleteMode = (data:IFacility)=>{
        setDeleteMode(true);
        setCurrentFacility(data);
    }
    const handleEditMode = (data:IFacility)=>{
        setEditMode(true);
        setCurrentFacility(data);
    }

    const handleNew=()=>{
        setCurrentFacility(null);
        setEditMode(true);
    }

    const handledeleteFacility = async()=>{
        try {
            if(currentFacility){
                const res = await deleteFacility(currentFacility?._id);
                // setResponse(res);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured. Please retry', {variant:'error'});
        }
    }

    const message = `You're about to delete a facility. This will delete rooms and keys depending on it`;
    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className='table-main2' >

        <div className="flex flex-col gap-3">
            {
                canCreate &&
                <div className="flex flex-row gap-4  items-center px-0  w-full md:justify-end">                
                    <AddButton onClick={handleNew} type="button" smallText text='Add Facility' noIcon className='rounded' />
                </div>
            }
        </div>

        <NewSingleFacility mine={mine} venueId={venueId} currentFacility={currentFacility} setCurrentFacility={setCurrentFacility} infoMode={editMode} setInfoMode={setEditMode} />
        <DeleteDialog onTap={handledeleteFacility} message={message} title={`Delete ${currentFacility?.name}`} value={deleteMode} setValue={setDeleteMode} />

        {/* {
          response?.message &&
          <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        } */}
        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    getRowId={(row:IFacility):string=> row?._id as string}
                    rows={facilities}
                    columns={SingleFacilityColumns(handleEditMode, handleDeleteMode, canUpdate, canDelete)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15,20]}
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

export default SingleFacilityTable