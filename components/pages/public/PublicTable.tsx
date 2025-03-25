'use client'
import AddButton from '@/components/features/AddButton';
// import SearchBar from '@/components/features/SearchBar';
// import SearchSelectCYPEvents from '@/components/features/SearchSelectCYPEvents';
import {   Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import {  SearchCYPSetV2 } from './fxn';
import {  useFetchCYPSetForEvent } from '@/hooks/fetch/useCYPSet';
import { ICYPSet } from '@/lib/database/models/cypset.model';
import { PublicColumns } from './PublicComuns';
// import { ErrorProps } from '@/types/Types';
import DeleteDialog from '@/components/DeleteDialog';
import { deleteCYPSet } from '@/lib/actions/cypset.action';
import Link from 'next/link';
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2';
import PublicEditModal from './PublicEditModal';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, eventRoles, questionSetRoles } from '@/components/auth/permission/permission';
import { useRouter } from 'next/navigation';

const PublicTable = () => {
    // const [search, setSearch] =useState<string>('');
    const {user} = useAuth();
    const [eventId, setEventId] = useState<string>('');
    const [currentSet, setCurrentSet] = useState<ICYPSet|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);

    const router = useRouter();
    // const [response, setResponse] = useState<ErrorProps>(null);

    const {cypsets, loading, refetch} = useFetchCYPSetForEvent(eventId);

    const creator = canPerformAction(user!, 'creator', {questionSetRoles});
    const updater = canPerformAction(user!, 'updater', {questionSetRoles});
    const deleter = canPerformAction(user!, 'deleter', {questionSetRoles});
    const reader = canPerformAction(user!, 'reader', {questionSetRoles});
    const eReader = canPerformAction(user!, 'reader', {eventRoles});
    const admin = canPerformAction(user!, 'admin', {questionSetRoles});

    useEffect(()=>{
      if(user && !admin){
        router.replace('/dashboard/forbidden?p=Set Admin')
      }
    },[admin, user, router])

    const hadndleDelete =(data:ICYPSet)=>{
      setDeleteMode(true);
      setCurrentSet(data);
    }

    const hadndleEdit =(data:ICYPSet)=>{
      setEditMode(true);
      setCurrentSet(data);
    }

    // console.log(eventId)

    const message = `Deleting an entire set will delete its sections, questions and responses. Are you sure you want to do this?`;

    const handleDeleteSet = async()=>{
      try {
        if(currentSet){
          const res = await deleteCYPSet(currentSet._id);
          // setResponse(res);
          enqueueSnackbar(res?.message, {variant: res?.error ? 'error':'success'});
          setDeleteMode(false);
          refetch();
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured deleting set', {variant:'error'});
      }
    }
    const paginationModel = { page: 0, pageSize: 10 };

    if(!admin) return;

  return (
    <div className='table-main2' >
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <SearchSelectEventsV2 setSelect={setEventId} />
            <div className="flex gap-4 items-center">
                {
                  creator &&
                  <Link href='/dashboard/events/public/new' >
                    <AddButton text='Add New Set' noIcon className='rounded' smallText />
                  </Link>
                }
            </div>
        </div>
        <PublicEditModal infoMode={editMode} setInfoMode={setEditMode} currentSet={currentSet} refetch={refetch} />
        <DeleteDialog title={`Delete ${currentSet?.title}`} message={message} value={deleteMode} setValue={setDeleteMode} onTap={handleDeleteSet} />
        
          {/* {
            response?.message &&
            <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
          } */}

        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 'auto', }}>
              <DataGrid
                  loading={loading && !!eventId}
                  rows={SearchCYPSetV2(cypsets,  eventId)}
                  columns={PublicColumns( hadndleDelete, hadndleEdit, reader, updater, deleter, eReader)}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10, 15, 20, 30, 15, 100]}
                  getRowId={(row:ICYPSet):string=>row._id}
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

export default PublicTable
