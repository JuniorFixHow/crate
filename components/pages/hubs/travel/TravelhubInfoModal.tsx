import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '@/components/features/customscroll.css';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { IEvent } from '@/lib/database/models/event.model';
import { ITravelhub } from '@/lib/database/models/travelhub.model';
import { canPerformAction, canPerformAdmin, canPerformEvent, churchRoles, eventOrganizerRoles, eventRegistrationRoles, eventRoles } from '@/components/auth/permission/permission';
import { IRegistration } from '@/lib/database/models/registration.model';
import { IMember } from '@/lib/database/models/member.model';
import { IChurch } from '@/lib/database/models/church.model';


export type TravelhubInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentHub:ITravelhub|null,
    setCurrentHub:Dispatch<SetStateAction<ITravelhub|null>>;
}

const TravelhubInfoModal = ({infoMode,   setInfoMode, currentHub, setCurrentHub}:TravelhubInfoModalProps) => {
    const {user} = useAuth();
    const event = currentHub?.eventId as IEvent;
    const reg = currentHub?.regId as IRegistration;
    const member = reg?.memberId as IMember;
    const church = member?.church as IChurch;

    const reader = canPerformAction(user!, 'reader', {eventRoles});
    const regReader = canPerformAction(user!, 'reader', {eventRegistrationRoles});
    const orgReader = canPerformEvent(user!, 'reader', {eventOrganizerRoles});

    const canReadEvent = (!event?.forAll && reader) || (event?.forAll && orgReader);
    const mine = event?.churchId?.toString() === user?.churchId;
    const canReadReg = (!event?.forAll && mine && regReader) || (event?.forAll && orgReader);
    const admin = canPerformAdmin(user!, 'reader', {churchRoles});
    
    const handleClose = ()=>{
        setCurrentHub(null);
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
        <div className="flex flex-col min-w-72 h-full bg-white dark:bg-[#0F1214] dark:border rounded-l-lg p-4 overflow-y-scroll scrollbar-custom">
            <div onClick={handleClose}  className="flex gap-1 cursor-pointer dark:text-white items-center mb-5">
               <IoIosArrowRoundBack size={24} /> 
               <span>Close</span>
            </div>

           

            <div className="flex flex-col gap-4">
                <div className="flex flex-col dark:text-slate-200">
                    {
                        canReadReg ?
                        <Link href={{pathname:'/dashboard/events/badges', query:{regId:reg?._id}}}  className='text-[1.3rem] font-bold table-link' >{member?.name}</Link>
                        :
                        <span  className='text-[1.3rem] font-bold' >{member?.name}</span>
                    }
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Church</span>
                    {
                        admin ?
                        <Link className='table-link' href={{pathname:'/dashboard/churches', query:{id:church?._id}}} >{church?.name}</Link>
                        :
                        <span className='text-[0.9rem]' >{church?.name}</span>
                    }
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Departure Airport</span>
                    <span className='text-[0.9rem]' >{currentHub?.depAirport}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Departure Time</span>
                    <span className='text-[0.9rem]' >{currentHub?.depTime}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Arrival Airport</span>
                    <span className='text-[0.9rem]' >{currentHub?.arrAirport}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Arrival Time</span>
                    <span className='text-[0.9rem]' >{currentHub?.arrTime}</span>
                </div>
                
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Arrival Terminal</span>
                    <span className='text-[0.9rem]' >{currentHub?.arrTerminal}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Requires Pickup</span>
                    <span className='text-[0.9rem]' >{currentHub?.pickup ? 'Yes':'No'}</span>
                </div>                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Notes</span>
                    <span className='text-[0.9rem]' >{currentHub?.notes}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    {
                        canReadEvent ?
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

export default TravelhubInfoModal