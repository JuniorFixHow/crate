import { Modal, Tooltip } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../../components/features/customscroll.css';
import Link from 'next/link';
import { IMusichub } from '@/lib/database/models/musichub.model';
import { useFetchMusicHubEvents } from '@/hooks/fetch/useMusichub';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, eventRoles, musichubRoles } from '@/components/auth/permission/permission';
import AddButton from '@/components/features/AddButton';
import DeleteDialog from '@/components/DeleteDialog';
import { removeMusicHubFromEvent, removeMusicHubFromEvents } from '@/lib/actions/musichub.action';
import { enqueueSnackbar } from 'notistack';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { IEvent } from '@/lib/database/models/event.model';


export type MusichubInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentHub:IMusichub|null,
    setCurrentHub:Dispatch<SetStateAction<IMusichub|null>>;
}

const MusichubInfoModal = ({infoMode,   setInfoMode, currentHub, setCurrentHub}:MusichubInfoModalProps) => {
    const {user} = useAuth();

    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [singleDeleteMode, setSingleDeleteMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentEvent, setCurrentEvent] = useState<IEvent|null>(null);

    const {events, refetch:reload} = useFetchMusicHubEvents(currentHub?._id as string);
    const reader = canPerformAction(user!, 'reader', {eventRoles});

    const updater = canPerformAction(user!, 'updater', {musichubRoles});

    const handleClose = ()=>{
        setCurrentHub(null);
        setInfoMode(false);
    }

    const removeFromEvents = async()=>{
        try {
            setLoading(true);
            if(currentHub){
                const res = await removeMusicHubFromEvents(currentHub?._id);     
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                reload();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing the music item from all events', {variant:'error'});
        }finally{
            setLoading(false);
            setDeleteMode(false);
        }
    }

    const removeFromSingleEvent = async()=>{
        try {
            if(currentEvent && currentHub){
                const hubIds = [currentHub?._id]
                const res = await removeMusicHubFromEvent(hubIds, currentEvent?._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                reload();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar(`Error occured removing from '${currentEvent?.name}'`, {variant:'error'});
        }finally{
            setSingleDeleteMode(false);
        }
    }

    const handleSingleDelete =(event:IEvent)=>{
        setSingleDeleteMode(true);
        setCurrentEvent(event);
    }

    const message2 = `You're about to remove '${currentHub?.title}' from '${currentEvent?.name}'. Are you sure?`

    const message = `You're about to remove '${currentHub?.title}' from all events. Are you sure?`

  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='flex size-full justify-end'
    >
        <div className="flex flex-col min-w-72 h-full bg-white dark:bg-[#0F1214] dark:border rounded-l-lg p-4 overflow-y-scroll scrollbar-custom">
            <div onClick={handleClose}  className="flex gap-1 cursor-pointer dark:text-white items-center mb-5">
               <IoIosArrowRoundBack size={24} /> 
               <span>Close</span>
            </div>

            <DeleteDialog  
                value={deleteMode} setValue={setDeleteMode}
                message={message} title={`Remove From All Events`}
                onTap={removeFromEvents}
            />
            <DeleteDialog  
                value={singleDeleteMode} setValue={setSingleDeleteMode}
                message={message2} title={`Remove From Event`}
                onTap={removeFromSingleEvent}
            />

            <div className="flex flex-col gap-4">
                <div className="flex flex-col dark:text-slate-200">
                    <span   className='text-[1.3rem] font-bold' >{currentHub?.title}</span>
                </div>
                {
                    currentHub?.contact &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Contact</span>
                        <span className='text-[0.9rem]' >{currentHub?.contact}</span>
                    </div>
                }
                {
                    currentHub?.email &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Email</span>
                        <Link target='_blank' href={`mailto:${currentHub?.email}`} className='table-link' >{currentHub?.email}</Link>
                    </div>
                }
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Type</span>
                    <span className='text-[0.9rem]' >{currentHub?.type}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Nature</span>
                    <span className='text-[0.9rem]' >{currentHub?.nature}</span>
                </div>                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Appearance</span>
                    <span className='text-[0.9rem]' >{currentHub?.appearance}</span>
                </div> 

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Affiliation</span>
                    <span className='text-[0.9rem]' >{currentHub?.affiliation}</span>
                </div>                                   
            </div>
            {
                events?.length > 0 &&
                <div className="flex flex-col mt-8 gap-5">
                    <div className="flex gap-5 flex-col">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Associated Events</span>
                        <div className="flex flex-col gap-4">
                                {
                                    events?.map((event)=>(
                                        <div key={event?._id}  className="flex gap-4 items-center">
                                        {
                                            reader ?
                                            <Link href={`/dashboard/events/${event?._id}`} className='table-link' >{event?.name}</Link>
                                            :
                                            <span className='text-[0.9rem]' >{event?.name}</span>
                                        }
                                        {
                                            updater &&
                                            <Tooltip title={'Remove from this event'} >
                                                <IoCloseCircleOutline color='red' className='cursor-pointer' size={24} onClick={()=>handleSingleDelete(event)} />
                                            </Tooltip>
                                        }
                                    </div>
                                    ))
                                }
                        </div>
                    </div>

                    {
                        updater &&
                        <AddButton onClick={()=>setDeleteMode(true)} smallText noIcon className='rounded py-2 justify-center' isDanger text={loading ? 'loading...':'Remove from all events'} />
                    }
                </div>
            }
        </div>
    </Modal>
  )
}

export default MusichubInfoModal