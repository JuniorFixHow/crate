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
import {  useFetchSectionsForSet } from '@/hooks/fetch/useSection';
// import { SearchSection } from '../section/fxn';
import SectionSelector from '../section/SectionSelector';
import { SinglePublicColumns } from './SinglePublicColumns';
import { enqueueSnackbar } from 'notistack';
import ResponseMain from './responses/ResponseMain';
import { ICYPSet } from '@/lib/database/models/cypset.model';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, canPerformEvent, eventOrganizerRoles, questionSectionRoles } from '@/components/auth/permission/permission';
import { useRouter } from 'next/navigation';
import { IEvent } from '@/lib/database/models/event.model';
import { checkIfAdmin } from '@/components/Dummy/contants';

type SinglePublicTableProps = {
    cypset:ICYPSet
}

const SinglePublicTable = ({cypset}:SinglePublicTableProps) => {
    const {user} = useAuth();
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [currentSection, setCurrentSection] = useState<ISection|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [title, setStitle]= useState<string>('Sections');

    const currentEvent = cypset?.eventId as IEvent;

    const router = useRouter();

    const {sections, loading, refetch} = useFetchSectionsForSet(cypset?._id)

    const message = `Deleting a section will delete its questions and responses received for it. Are you sure?`;

    const hasQuestions = sections?.some((item)=>item?.questions?.length > 0);

    const titles = hasQuestions ? ['Sections', 'Responses'] : ['Sections'];

    const isAdmin = checkIfAdmin(user);

    const mine = cypset.createdBy.toString() === user?.userId
    const creator = (canPerformAction(user!, 'creator', {questionSectionRoles}) && !currentEvent?.forAll && currentEvent?.churchId === user?.churchId) || mine || (canPerformEvent(user!, 'creator', {eventOrganizerRoles}) && currentEvent?.forAll) || isAdmin;
    const reader = (canPerformAction(user!, 'reader', {questionSectionRoles}) && !currentEvent?.forAll && currentEvent?.churchId === user?.churchId) || mine || (canPerformEvent(user!, 'reader', {eventOrganizerRoles}) && currentEvent?.forAll) || isAdmin;
    const updater = (canPerformAction(user!, 'updater', {questionSectionRoles}) && !currentEvent?.forAll && currentEvent?.churchId === user?.churchId) || mine || (canPerformEvent(user!, 'updater', {eventOrganizerRoles}) && currentEvent?.forAll) || isAdmin;
    const deleter = (canPerformAction(user!, 'deleter', {questionSectionRoles}) && !currentEvent?.forAll && currentEvent?.churchId === user?.churchId) || mine || (canPerformEvent(user!, 'deleter', {eventOrganizerRoles}) && currentEvent?.forAll) || isAdmin;
    const admin = (canPerformAction(user!, 'admin', {questionSectionRoles}) && !currentEvent?.forAll && currentEvent?.churchId === user?.churchId) || mine || (canPerformEvent(user!, 'admin', {eventOrganizerRoles}) && currentEvent?.forAll) || isAdmin;

    useEffect(()=>{
        if(user && (!admin)){
            router.replace('/dashboard/forbidden?p=Set Admin');
        }
    },[user, admin, router])

    const handleDeleteSection = async()=>{
        try {
            if(currentSection){
                const res = await deleteSection(currentSection?._id);
                setResponse(res);
                setDeleteMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
                refetch();
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
        setInfoMode(true);
    }

    const paginationModel = { page: 0, pageSize: 10 };

    if(!admin) return;

  return (
    <div className='table-main2' >
        <div className="flex flex-col gap-5 md:flex-row justify-between">
            <div className="flex gap-4">
                {
                    titles.map((item)=>{
                        const selected = item === title;
                        return(
                            <div onClick={()=>setStitle(item)} className={`${selected && 'border-b-2'} border-blue-500 px-2 cursor-pointer py-1`} key={item} >
                                <span className={`font-semibold text-[1rem] ${!selected && 'text-blue-500'}`} >{item}</span>
                            </div>
                        )
                    })
                }
            </div>
            {
                creator &&
                <div className="flex gap-4 items-center">
                    <AddButton onClick={handleNew} text='Add New Section' noIcon className='rounded' smallText />
                </div>
            }
        </div>

        <DeleteDialog title={`Delete ${currentSection?.title}`} message={message} value={deleteMode} setValue={setDeleteMode} onTap={handleDeleteSection} />
        <SectionSelector refetch={refetch} setInfoMode={setInfoMode} infoMode={infoMode} cypsetId={cypset?._id} />
        {
            response?.message &&
            <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }


        {
            title === 'Sections' ?
            <div className="flex w-full">
                <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    rows={sections}
                    columns={SinglePublicColumns( handleDelete, reader, updater, deleter)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20, 30, 50, 100]}
                    getRowId={(row:ISection):string=>row?._id}
                    slots={{toolbar:GridToolbar}}
                    loading={loading && !!cypset?._id}
                    slotProps={{
                        toolbar:{
                            showQuickFilter:true,
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true
                            }
                        }
                    }}
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
                </Paper>
            </div>
            :
            <ResponseMain setId={cypset._id} />
        }

    </div>
  )
}

export default SinglePublicTable