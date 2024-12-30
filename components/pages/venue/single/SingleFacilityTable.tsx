'use client'
import DeleteDialog from "@/components/DeleteDialog"
import AddButton from "@/components/features/AddButton";
import SearchBar from "@/components/features/SearchBar";

import { ErrorProps } from "@/types/Types";
import { Alert,  Paper } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useState } from "react";
import { deleteFacility } from "@/lib/actions/facility.action";
import { IFacility } from "@/lib/database/models/facility.model";
import { SingleFacilityColumns } from "./SingleFacilityColumns";
import NewSingleFacility from "./NewSingleFacility";
import { SearchFacility } from "./fxn";

type SingleFacilityTableProps ={
    facilities:IFacility[],
    venueId:string
}

const SingleFacilityTable = ({facilities, venueId}:SingleFacilityTableProps) => {
    const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentFacility, setCurrentFacility] = useState<IFacility|null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);


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
                setResponse(res);
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured. Please retry', error:true})
        }
    }

    const message = `You're about to delete a facility. This will delete rooms and keys depending on it`;
    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded' >

        <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-4  items-center px-0  w-full justify-end">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                
                <AddButton onClick={handleNew} type="button" smallText text='Add Facility' noIcon className='rounded' />
            </div>
        </div>

        <NewSingleFacility venueId={venueId} currentFacility={currentFacility} setCurrentFacility={setCurrentFacility} infoMode={editMode} setInfoMode={setEditMode} />
        <DeleteDialog onTap={handledeleteFacility} message={message} title={`Delete ${currentFacility?.name}`} value={deleteMode} setValue={setDeleteMode} />

        {
          response?.message &&
          <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }
        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    getRowId={(row:IFacility):string=> row?._id as string}
                    rows={SearchFacility(facilities, search).sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1)}
                    columns={SingleFacilityColumns(handleEditMode, handleDeleteMode)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
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