'use client'
import AddButton from "@/components/features/AddButton";
import SearchBar from "@/components/features/SearchBar";
import SearchSelectChurchForRoomAss from "@/components/features/SearchSelectChurchForRoomAss";
import SearchSelectZones from "@/components/features/SearchSelectZones";
import { useFetchCampuses } from "@/hooks/fetch/useCampus";
import { ICampuse } from "@/lib/database/models/campuse.model";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { CampusColumn } from "./CampusColumn";
import DeleteDialog from "@/components/DeleteDialog";
import CampusInfoModal from "./CampusInfoModal";
import NewCampus from "./NewCampus";
import { ErrorProps } from "@/types/Types";
import { deleteCampuse, getCampuse } from "@/lib/actions/campuse.action";
import { SearchCampuseWithEverything } from "./fxn";
import { useSearchParams } from "next/navigation";

const CampusTable = () => {
    const [zoneId, setZoneId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentCampus, setCurrentCampus] = useState<ICampuse|null>(null);
    const [editmode, setEditmode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const {campuses, loading} = useFetchCampuses();
    const searchParams = useSearchParams();

    useEffect(()=>{
      const id = searchParams.get('id');
      const fetchCampus = async()=>{
        try {
          if(id){
            const camous = await getCampuse(id) as ICampuse;
            setCurrentCampus(camous);
            setInfoMode(true);
          }
        } catch (error) {
          console.log(error);
          setResponse({message:'Error occured fetching campuse data', error:true});
        }
      }
      fetchCampus();
    },[searchParams])

    const handleOpenNew = ()=>{
        setCurrentCampus(null);
        setEditmode(true);
    }

    const handleEditMode = (data:ICampuse)=>{
        setCurrentCampus(data);
        setEditmode(true);
    }

    const handleDeleteMode = (data:ICampuse)=>{
        setCurrentCampus(data);
        setDeleteMode(true);
    }

    const handleInfoMode = (data:ICampuse)=>{
        setCurrentCampus(data);
        setInfoMode(true);
    }

    const handledeleteCampus = async() =>{
      try {
        if(currentCampus){
          const res = await deleteCampuse(currentCampus._id);
          setResponse(res);
        }
      } catch (error) {
        console.log(error);
        setResponse({message:'Error occured deleting campus.', error:true});
      }finally{
        setDeleteMode(false);
      }
    }

    const message = `You're about to delete a campus. The members will still be in the church but won't have any campus. Proceed?`;
    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded' >
        <div className="flex flex-col gap-5 lg:flex-row items-start xl:items-end lg:justify-between w-full">
            <div className="flex flex-col gap-3 xl:flex-row items-start xl:items-end">
                <SearchSelectZones isGeneric setSelect={setZoneId} />
                <SearchSelectChurchForRoomAss zoneId={zoneId} isGeneric setSelect={setChurchId} />
            </div>
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <AddButton onClick={handleOpenNew} smallText text='Add Campus' noIcon className='rounded' />
            </div>
        </div> 

        <NewCampus infoMode={editmode} setInfoMode={setEditmode} setCurrentCampus={setCurrentCampus} currentCampus={currentCampus} />
        <CampusInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentCampus={currentCampus} setCurrentCampus={setCurrentCampus} />
        <DeleteDialog onTap={handledeleteCampus} message={message} title={`Delete ${currentCampus?.name}`} value={deleteMode} setValue={setDeleteMode} />

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
                    getRowId={(row:ICampuse):string=> row?._id as string}
                    rows={SearchCampuseWithEverything(campuses, zoneId, churchId, search)}
                    columns={CampusColumn(handleInfoMode, handleEditMode, handleDeleteMode)}
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

export default CampusTable