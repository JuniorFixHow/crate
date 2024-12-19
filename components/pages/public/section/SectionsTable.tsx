'use client'
import DeleteDialog from '@/components/DeleteDialog';
import AddButton from '@/components/features/AddButton';
import SearchBar from '@/components/features/SearchBar';
import SearchSelectSet from '@/components/features/SearchSelectSet';
import { deleteSection } from '@/lib/actions/section.action';
import { ISection } from '@/lib/database/models/section.model';
import { ErrorProps } from '@/types/Types';
import { Alert, LinearProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react'
import { SearchSectionWithSet } from './fxn';
import { useFetchSections } from '@/hooks/fetch/useSection';
import SectionSelector from './SectionSelector';
import { SectionColumns } from './SectionColumns';

const SectionsTable = () => {
    const [search, setSearch] = useState<string>('');
    const [cypsetId, setCypsetId] = useState<string>('');
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [currentSection, setCurrentSection] = useState<ISection|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);

    const {sections, loading} = useFetchSections()

    const message = `Deleting a section will delete its questions and responses received for it. Are you sure?`;

    const handleDeleteSection = async()=>{
        try {
            if(currentSection){
                const res = await deleteSection(currentSection._id);
                setResponse(res);
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured deleting section', error:true})
        }
    }

    const handleDelete =(data:ISection)=>{
        setCurrentSection(data);
        setDeleteMode(true);
    }

    const handleNew = ()=>{
        if(!cypsetId){
            setResponse({message:'Please select a set ID', error:true});
        }else{
            setInfoMode(true);
        }
    }

    const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className='table-w' >
        <div className="flex justify-between items-end">
            <SearchSelectSet isGeneric setSelect={setCypsetId} />
            <div className="flex gap-4 items-center">
                <SearchBar setSearch={setSearch} reversed={false} />
                <AddButton onClick={handleNew} text='Add New Section' noIcon className='rounded' smallText />
            </div>
        </div>

        <DeleteDialog title={`Delete ${currentSection?.title}`} message={message} value={deleteMode} setValue={setDeleteMode} onTap={handleDeleteSection} />
        <SectionSelector setInfoMode={setInfoMode} infoMode={infoMode} cypsetId={cypsetId} />
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
                  rows={SearchSectionWithSet(sections, search, cypsetId)}
                  columns={SectionColumns( handleDelete)}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  getRowId={(row:ISection):string=>row._id}
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

export default SectionsTable