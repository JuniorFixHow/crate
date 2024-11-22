"use client"
import AddButton from '@/features/AddButton';
import SearchBar from '@/features/SearchBar'
import { Paper } from '@mui/material';
import React, { useState } from 'react'
import { SearchZone } from './fxn';
import { ZoneData } from './ZoneData';
import { DataGrid } from '@mui/x-data-grid';
import { ZoneColumns } from './ZoneColumn';
import { ZoneProps } from '@/types/Types';
import NewZone from './NewZone';
import DeleteDialog from '@/components/DeleteDialog';
import ZoneInfoModal from './ZoneInfoModal';

const ZonesTable = () => {
  const [search, setSearch] = useState<string>('');
  const [currentZone, setCurrentZone] = useState<ZoneProps|null>(null);
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [infoMode, setInfoMode] = useState<boolean>(false);
  const paginationModel = { page: 0, pageSize: 10 };
  
  const handleZoneClick = (data:ZoneProps)=>{
    setCurrentZone(data);
    setOpenNew(true);
  }

  const handleInfoClick = (data:ZoneProps)=>{
    setCurrentZone(data);
    setInfoMode(true);
  }


  const message = `Deleting a zone will also delete its dependants such as churches and members. This is very critical and you're advised to rather delete the members or churches that are no longer required. Do you still want to delete this zone?`;
  const handleDeleteModal = (data:ZoneProps)=>{
    setCurrentZone(data);
    setDeleteMode(true);
  }
  return (
    <div className='flex flex-col border p-4  bg-white dark:bg-black md:w-full lg:w-[90%] flex-wrap relative' >
      <div className="flex flex-row w-full gap-4 justify-end items-center px-4">
        <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
        <AddButton onClick={()=>setOpenNew(true)} smallText text='Add Zone' noIcon className='rounded' />
      </div>

      <NewZone openZone={openNew} setOpenZone={setOpenNew} currentZone={currentZone} setCurrentZone={setCurrentZone} />
      <ZoneInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentZone={currentZone} setCurrentZone={setCurrentZone} />
      <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentZone?.name}`} message={message} onTap={()=>{}} />
      
      <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={SearchZone(ZoneData, search)}
                    columns={ZoneColumns(handleZoneClick, handleDeleteModal, handleInfoClick)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    </div>
  )
}

export default ZonesTable
