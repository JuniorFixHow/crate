import { canPerformAction, eventRegistrationRoles, eventRoles, roomRoles, venueRoles } from '@/components/auth/permission/permission'
import { useAuth } from '@/hooks/useAuth'
import { IEvent } from '@/lib/database/models/event.model'
import { IKey } from '@/lib/database/models/key.model'
import { IMember } from '@/lib/database/models/member.model'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IRoom } from '@/lib/database/models/room.model'
import { IVenue } from '@/lib/database/models/venue.model'
import { Modal } from '@mui/material'
import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'

export type KeyInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentKey:IKey|null,
    setCurrentKey:Dispatch<SetStateAction<IKey|null>>
}

const KeyInfoModal = ({infoMode, setInfoMode, currentKey, setCurrentKey}:KeyInfoModalProps) => {
    const {user} = useAuth();
    const room = currentKey?.roomId as IRoom;
    const venue = room?.venueId as IVenue;
    const event = room?.eventId as IEvent;
    const holder = currentKey?.holder as IRegistration;
    const member = holder?.memberId as IMember;

    const showMember = canPerformAction(user!, 'reader', {eventRegistrationRoles});
    const showRoom = canPerformAction(user!, 'reader', {roomRoles});
    const showVenue = canPerformAction(user!, 'reader', {venueRoles});
    const showEvent = canPerformAction(user!, 'reader', {eventRoles});

    const handleClose = ()=>{
        setCurrentKey(null);
        setInfoMode(false);
    }
  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='flex size-full justify-end'
    >
        <div className="flex flex-col min-w-72 h-full bg-white dark:bg-black dark:border rounded-l-lg p-4 overflow-y-scroll scrollbar-custom">
            <div onClick={handleClose}  className="flex gap-1 cursor-pointer dark:text-white items-center mb-5">
               <IoIosArrowRoundBack size={24} /> 
               <span>Close</span>
            </div>

            <div className="flex flex-col gap-4">
            <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.3rem] font-bold' >{currentKey?.code}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Room</span>
                    {
                        showRoom ?
                        <Link href={{pathname:'/dashboard/rooms', query:{id:room?._id}}} className='table-link' >{venue?.name} - {room?.number}</Link>
                        :
                        <span className='text-[0.9rem]'>{venue?.name} - {room?.number}</span>
                    }
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Holder</span>
                    {
                        holder?
                        <>
                        {
                            showMember?
                            <Link href={{pathname:'/dashboard/events/badges', query:{regId:holder?._id}}}  className='text-[0.9rem]' >{member?.name}</Link>
                            :
                            <span  className='text-[0.9rem]' >{member?.name}</span>
                        }
                        </>
                        :
                        <span className='text-[0.9rem]' >None</span>
                    }
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Assigned On</span>
                    {
                        holder ?
                        <span className='text-[0.9rem]' >{currentKey?.assignedOn && new Date(currentKey?.assignedOn)?.toLocaleDateString()}</span>
                        :
                        <span className='text-[0.9rem]' >N/A</span>
                    }
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Key Status</span>
                    <span className='text-[0.9rem]' >{currentKey?.holder && !currentKey?.returned ? 'In user':'Available'}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Returned On</span>
                    {
                        currentKey?.returned ?
                        <span className='text-[0.9rem]' >{currentKey?.returnedDate && new Date(currentKey?.returnedDate)?.toLocaleDateString()}</span>
                        :
                        <span className='text-[0.9rem]' >N/A</span>
                    }
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Venue</span>
                    {
                        showVenue ?
                        <Link className='table-link' href={`/dashboard/venues/${venue?._id}`} >{venue?.name}</Link>
                        :
                        <span className='text-[0.9rem]'>{venue?.name}</span>
                    }
                    <span className='text-[0.9rem]' >N/A</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    {
                        showEvent ?
                        <Link className='table-link' href={`/dashboard/events/${event?._id}`} >{event?.name}</Link>
                        :
                        <span className='text-[0.9rem]' >{event?.name}</span>
                    }
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default KeyInfoModal