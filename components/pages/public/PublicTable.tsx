'use client'
import AddButton from '@/components/features/AddButton';
import SearchBar from '@/components/features/SearchBar';
import SearchSelectCYPEvents from '@/components/features/SearchSelectCYPEvents';
import { Alert, LinearProgress, Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useState } from 'react'
import { SearchCYPSet } from './fxn';
import { useFetchCYPSet } from '@/hooks/fetch/useCYPSet';
import { ICYPSet } from '@/lib/database/models/cypset.model';
import { PublicColumns } from './PublicComuns';
import { ErrorProps } from '@/types/Types';
import DeleteDialog from '@/components/DeleteDialog';
import { deleteCYPSet } from '@/lib/actions/cypset.action';
import Link from 'next/link';

const PublicTable = () => {
    const [search, setSearch] =useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [currentSet, setCurrentSet] = useState<ICYPSet|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);

    const {cypsets, loading} = useFetchCYPSet()

    const hadndleDelete =(data:ICYPSet)=>{
      setDeleteMode(true);
      setCurrentSet(data);
    }

    const message = `Deleting an entire set will delete its sections, questions and responses. Are you sure you want to do this?`;

    const handleDeleteSet = async()=>{
      try {
        if(currentSet){
          const res = await deleteCYPSet(currentSet._id);
          setResponse(res);
          setDeleteMode(false);
        }
      } catch (error) {
        console.log(error);
        setResponse({message:'Error occured deleting set', error:true});
      }
    }

  

    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className='table-w' >
        <div className="flex justify-between items-end">
            <SearchSelectCYPEvents isGeneric setSelect={setEventId} />
            <div className="flex gap-4 items-center">
                <SearchBar setSearch={setSearch} reversed={false} />
                <Link href='/dashboard/events/public/new' >
                  <AddButton text='Add New Set' noIcon className='rounded' smallText />
                </Link>
            </div>
        </div>
        <DeleteDialog title={`Delete ${currentSet?.title}`} message={message} value={deleteMode} setValue={setDeleteMode} onTap={handleDeleteSet} />
        
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
                  rows={SearchCYPSet(cypsets, search, eventId)}
                  columns={PublicColumns( hadndleDelete)}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  getRowId={(row:ICYPSet):string=>row._id}
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

export default PublicTable
