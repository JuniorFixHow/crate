"use client"
import AddButton from '@/components/features/AddButton';
import SearchBar from '@/components/features/SearchBar'
import { Alert, LinearProgress, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { SearchZone } from './fxn';
import { DataGrid } from '@mui/x-data-grid';
import { ZoneColumns } from './ZoneColumn';
import NewZone from './NewZone';
import DeleteDialog from '@/components/DeleteDialog';
import ZoneInfoModal from './ZoneInfoModal';
import { IZone } from '@/lib/database/models/zone.model';
import { useFetchZones } from '@/hooks/fetch/useZone';
import { deleteZone, getZone } from '@/lib/actions/zone.action';
import { ErrorProps } from '@/types/Types';
import { useSearchParams } from 'next/navigation';

const ZonesTable = () => {
  const [search, setSearch] = useState<string>('');
  const [currentZone, setCurrentZone] = useState<IZone|null>(null);
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [infoMode, setInfoMode] = useState<boolean>(false);
  const paginationModel = { page: 0, pageSize: 10 };
  const [deleteState, setDeleteState]=useState<ErrorProps>({message:'', error:false});
  
  const {zones, loading} =  useFetchZones();
  const searchParams = useSearchParams();
  // console.log(zones)
  const handleZoneClick = (data:IZone)=>{
    setCurrentZone(data);
    setOpenNew(true);
  }

  const handleInfoClick = (data:IZone)=>{
    setCurrentZone(data);
    setInfoMode(true);
  }


    useEffect(() => {
        const fetchChurch = async () => {
          const data = searchParams?.get('id');
          if (data) {
            const church: IZone = await getZone(data); // Await the promise
            setCurrentZone(church);
            setInfoMode(true);
          }
        };
      
        fetchChurch(); // Call the async function
      }, [searchParams]);


  const message = `Deleting a zone will also delete its dependants such as churches and members. This is very critical and you're advised to rather delete the members or churches that are no longer required. Do you still want to delete this zone?`;
  const handleDeleteModal = (data:IZone)=>{
    setCurrentZone(data);
    setDeleteMode(true);
  }

  const handleOpenNew=()=>{
    setOpenNew(true);
    setCurrentZone(null);
  }

  const handleDeleteZone = async()=>{
    setDeleteState({message:'', error:false})
    if(currentZone){
      try {
        await deleteZone(currentZone._id);
        setDeleteMode(false);
        setCurrentZone(null);
        setDeleteState({message:'Zone deleted successfully', error:false})
      } catch (error) {
        console.log(error)
        setDeleteState({message:'Error occured deleting zone', error:true})
      }
    }
  }

  return (
    <div className='flex flex-col border p-4  bg-white dark:bg-[#0F1214] rounded md:w-full lg:w-[90%] flex-wrap relative' >
      <div className="flex flex-row w-full gap-4 justify-end items-center px-4 pb-4">
        <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
        <AddButton onClick={handleOpenNew} smallText text='Add Zone' noIcon className='rounded' />
      </div>
      {
        deleteState?.message &&
        <Alert onClose={()=>setDeleteState({message:'', error:false})}  className='text-center' severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
      }
      <NewZone openZone={openNew} setOpenZone={setOpenNew} currentZone={currentZone} setCurrentZone={setCurrentZone} />
      <ZoneInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentZone={currentZone} setCurrentZone={setCurrentZone} />
      <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentZone?.name}`} message={message} onTap={handleDeleteZone} />
      
      <div className="flex w-full">
        {
          loading ? 
          <LinearProgress className='w-full' />
          :
          <Paper className='w-full' sx={{ height: 480, }}>
              <DataGrid
                  getRowId={(row:IZone):string=>row?._id as string}
                  rows={SearchZone(zones, search)}
                  columns={ZoneColumns(handleZoneClick, handleDeleteModal, handleInfoClick)}
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

export default ZonesTable
