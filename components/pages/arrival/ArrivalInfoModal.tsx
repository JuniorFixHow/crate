import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import '@/components/features/customscroll.css';
import Link from 'next/link';
import { IRegistration } from '@/lib/database/models/registration.model';
import { IMember } from '@/lib/database/models/member.model';
import { IGroup } from '@/lib/database/models/group.model';
import { IRoom } from '@/lib/database/models/room.model';
import { IEvent } from '@/lib/database/models/event.model';
import { IKey } from '@/lib/database/models/key.model';
import { formatTimestamp } from '@/functions/dates';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, eventRoles, groupRoles, keyRoles, memberRoles, roomRoles } from '@/components/auth/permission/permission';

export type ArrivalInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>
    currentEventReg:IRegistration|null,
    setCurrentEventReg:Dispatch<SetStateAction<IRegistration|null>>
}

const ArrivalInfoModal = ({infoMode, setInfoMode, setCurrentEventReg, currentEventReg}:ArrivalInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentEventReg(null);
        setInfoMode(false);
    }

    const {user} = useAuth();
    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const showEvent = canPerformAction(user!, 'reader', {eventRoles});
    const showGroup = canPerformAction(user!, 'reader', {groupRoles});
    const showRoom = canPerformAction(user!, 'reader', {roomRoles});
    const showKey = canPerformAction(user!, 'reader', {keyRoles});

    
    const member = currentEventReg?.memberId as IMember | undefined;
    const group = currentEventReg?.groupId as IGroup | undefined;
    const rooms = currentEventReg?.roomIds as IRoom[] | undefined;
    const event = currentEventReg?.eventId as IEvent | undefined;
    const key = currentEventReg?.keyId as IKey | undefined;

    if(!currentEventReg) return null;
  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='flex size-full justify-end'
    >
        <div className="info-modal scrollbar-custom">
            <div onClick={handleClose}  className="flex gap-1 cursor-pointer dark:text-white items-center mb-5">
               <IoIosArrowRoundBack size={24} /> 
               <span>Close</span>
            </div>

            <div className="flex flex-col gap-4">
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Member</span>
                    {
                        showMember ?
                        <Link href={{pathname:`/dashboard/events/badges`, query:{regId:currentEventReg?._id}}}   className='text-[0.9rem] table-link' >{
                        member?.name
                        }</Link>
                        :
                        <span className='text-[0.9rem]' >{member?.name}</span>
                    }
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Arrived On</span>
                    <span className='text-[0.9rem]' >{formatTimestamp(currentEventReg?.checkedIn?.date)}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Registration type</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.groupId ? 
                    group?.type
                    :
                    'Individual'
                    }</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Check-in Status</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.checkedIn?.checked ? 'Checked-in':'Not yet'}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Badge Printed</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.badgeIssued}</span>
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Group/Family</span>
                    {
                        currentEventReg?.groupId ?
                        <>
                        {
                            showGroup ?
                            <Link href={`/dashboard/groups/${group?._id}`}   className='text-[0.9rem] table-link' >{
                                group?.name
                            }</Link>
                            :
                            <span className='text-[0.9rem]' >{group?.name}</span> 
                        }
                        </>
                        :
                        <span className='text-[0.9rem]' >N/A</span> 
                    }
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Room</span>
                    {
                        rooms?.length  === 0 ?
                        <span className='text-[0.9rem]' >N/A</span>:
                        rooms?.map((item)=>(
                            <>
                            {
                                showRoom ?
                                <Link key={item?._id} href={{pathname:`/dashboard/rooms`, query:{id:item?._id}}}   className='text-[0.9rem] table-link' >{
                                    item?.number
                                }</Link>
                                :   
                                <span key={item?._id} className='text-[0.9rem]' >{item?.number}</span> 
                            }
                            </>
                        ))
                        
                    }
                </div>
                {
                    key &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Key</span>
                        {
                            showKey ?
                            <Link href={{pathname:`/dashboard/rooms/keys`, query:{id:key?._id}}}   className='text-[0.9rem] dark:text-white table-link' >{
                                key?.code
                            }</Link>
                            :
                            <span  className='text-[0.9rem]' >{key?.code}</span> 
                        }
                    </div>
                }
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    {
                        showEvent ?
                        <Link href={`/dashboard/events/${event?._id}`}   className='text-[0.9rem] dark:text-white table-link' >{
                            event?.name
                        }</Link>
                        :
                        <span  className='text-[0.9rem]' >{event?.name}</span> 
                    }
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default ArrivalInfoModal