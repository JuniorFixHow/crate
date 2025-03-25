'use client'
import DeleteDialog from '@/components/DeleteDialog';
import AddButton from '@/components/features/AddButton';
// import SearchBar from '@/components/features/SearchBar';
import { deleteSection } from '@/lib/actions/section.action';
import { ISection } from '@/lib/database/models/section.model';
import { ErrorProps } from '@/types/Types';
import { Alert,  Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import {  SearchSectionWithSetV2 } from './fxn';
import { useFetchSections } from '@/hooks/fetch/useSection';
import SectionSelector from './SectionSelector';
import { SectionColumns } from './SectionColumns';
import { enqueueSnackbar } from 'notistack';
import SearchSelectCYPSetV2 from '@/components/features/SearchSelectSetV2';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, questionSectionRoles, questionSetRoles } from '@/components/auth/permission/permission';
import { useRouter } from 'next/navigation';

const SectionsTable = () => {
    const {user} = useAuth();
    // const [search, setSearch] = useState<string>('');
    const [cypsetId, setCypsetId] = useState<string>('');
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [currentSection, setCurrentSection] = useState<ISection|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);

    const router = useRouter();

    const {sections, loading} = useFetchSections()

    const message = `Deleting a section will delete its questions and responses received for it. Are you sure?`;

    const creator = canPerformAction(user!, 'creator', {questionSectionRoles});
    const reader = canPerformAction(user!, 'reader', {questionSectionRoles});
    const updater = canPerformAction(user!, 'updater', {questionSectionRoles});
    const deleter = canPerformAction(user!, 'deleter', {questionSectionRoles});
    const admin = canPerformAction(user!, 'admin', {questionSectionRoles});
    const sUpdater = canPerformAction(user!, 'updater', {questionSetRoles});
    const sReader = canPerformAction(user!, 'reader', {questionSetRoles});
    const canDelete = deleter || sUpdater;

    useEffect(()=>{
        if(user && (!admin && !sUpdater)){
            router.replace('/dashboard/forbidden?p=Section Admin')
        }
    },[user, admin, sUpdater, router])

    const handleDeleteSection = async()=>{
        try {
            if(currentSection){
                const res = await deleteSection(currentSection._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting section', {variant:'error'});
        }
    }

    const handleDelete =(data:ISection)=>{
        setCurrentSection(data);
        setDeleteMode(true);
    }

    const handleNew = ()=>{
        if(!cypsetId){
            enqueueSnackbar('Please select a set ID', {variant:'error'});
        }else{
            setInfoMode(true);
        }
    }

    const paginationModel = { page: 0, pageSize: 10 };

    if(!admin && !sUpdater) return;

  return (
    <div className='table-main2' >
        <div className="flex justify-between items-end">
            <SearchSelectCYPSetV2 setSelect={setCypsetId} />
            <div className="flex gap-4 items-center">
                {/* <SearchBar setSearch={setSearch} reversed={false} /> */}
                {
                    (sUpdater || creator) &&
                    <AddButton onClick={handleNew} text='Add New Section' noIcon className='rounded' smallText />
                }
            </div>
        </div>

        <DeleteDialog title={`Delete ${currentSection?.title}`} message={message} value={deleteMode} setValue={setDeleteMode} onTap={handleDeleteSection} />
        <SectionSelector setInfoMode={setInfoMode} infoMode={infoMode} cypsetId={cypsetId} />
        {
            response?.message &&
            <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }


        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 'auto', }}>
              <DataGrid
                  rows={SearchSectionWithSetV2(sections, cypsetId)}
                  columns={SectionColumns( handleDelete, reader, updater, canDelete, sReader)}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                  getRowId={(row:ISection):string=>row._id}
                  loading={loading}
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

export default SectionsTable