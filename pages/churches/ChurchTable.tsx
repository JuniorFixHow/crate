'use client'
import AddButton from '@/features/AddButton';
import SearchBar from '@/features/SearchBar'
import React, { useEffect, useState } from 'react'
import ChurchFilter from './ChurchFilter';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { SearchChurch } from './fxn';
import { ChurchColumns } from './ChurchColumns';
import { ChurchData } from './ChurchData';
import { ChurchProps } from '@/types/Types';
import DeleteDialog from '@/components/DeleteDialog';
import ChurchInfoModal from './ChurchInfoModal';
import NewChurch from './NewChurch';
import { useSearchParams } from 'next/navigation';

const ChurchTable = () => {
    const [search, setSearch] = useState<string>('');
    const [zone, setZone] = useState<string>('All Zones');
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentChurch, setCurrentChurch] = useState<ChurchProps|null>(null);
    // console.log('zone: ', zone)

    const searchParams = useSearchParams();
    useEffect(()=>{
        const data = searchParams?.get('id');
        if(data){
            const church = ChurchData.filter((item)=>item.id === data)[0];
            setCurrentChurch(church);
            setInfoMode(true);
        }

    },[searchParams])

    const paginationModel = { page: 0, pageSize: 10 };

    const handleNewChurch = (data:ChurchProps)=>{
        setCurrentChurch(data);
        setNewMode(true);
    }

    const hadndleInfo = (data:ChurchProps)=>{
        setCurrentChurch(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:ChurchProps)=>{
        setCurrentChurch(data);
        setDeleteMode(true);
    }

    const message = 'Deleting the church will delete all members that have been registered for it. Proceed?'
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-black dark:border rounded' >
        <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
          <ChurchFilter setZone={setZone} />
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <AddButton onClick={()=>setNewMode(true)} smallText text='Add Church' noIcon className='rounded' />
            </div>
        </div> 
        <ChurchInfoModal currentChurch={currentChurch} setCurrentChurch={setCurrentChurch} infoMode={infoMode} setInfoMode={setInfoMode} />
        <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentChurch?.name}`} message={message} onTap={()=>{}} />
        <NewChurch currentChurch={currentChurch} setCurrentChurch={setCurrentChurch} infoMode={newMode} setInfoMode={setNewMode} />

        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={SearchChurch(ChurchData, search, zone)}
                    columns={ChurchColumns(hadndleInfo, handleNewChurch, hadndleDelete)}
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

export default ChurchTable