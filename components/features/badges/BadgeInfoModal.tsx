import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import '../customscroll.css';
import Link from 'next/link';
import { IRegistration } from '@/lib/database/models/registration.model';
import { IMember } from '@/lib/database/models/member.model';
import { IGroup } from '@/lib/database/models/group.model';
import { IRoom } from '@/lib/database/models/room.model';
import { IEvent } from '@/lib/database/models/event.model';
import { IKey } from '@/lib/database/models/key.model';

export type BadgeInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>
    currentEventReg:IRegistration|null,
    setCurrentEventReg:Dispatch<SetStateAction<IRegistration|null>>
}

const BadgeInfoModal = ({infoMode, setInfoMode, setCurrentEventReg, currentEventReg}:BadgeInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentEventReg(null);
        setInfoMode(false);
    }
    
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
                    
                    <Link href={`/dashboard/members/${member?._id}`}   className='text-[0.9rem] table-link' >{
                    member?.name
                    }</Link>
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
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Room Assignment Status</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.roomIds?.length === 0 ? 'Pending':'Assigned'}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Badge Printed</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.badgeIssued}</span>
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Group/Family</span>
                    {
                        currentEventReg?.groupId ?
                        <Link href={`/dashboard/groups/${group?._id}`}   className='text-[0.9rem] table-link' >{
                            group?.name
                        }</Link>
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
                            <Link key={item?._id} href={{pathname:`/dashboard/rooms`, query:{id:item?._id}}}   className='text-[0.9rem] table-link' >{
                                item.number
                            }</Link>   
                        ))
                        
                    }
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Key</span>
                    {
                        key ?
                        <Link href={{pathname:`/dashboard/rooms/keys`, query:{id:key?._id}}}   className='text-[0.9rem] dark:text-white table-link' >{
                            key?.code
                        }</Link>
                        :
                        <span className='text-[0.9rem]' >None</span> 
                    }
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    <Link href={`/dashboard/events/${event?._id}`}   className='text-[0.9rem] dark:text-white table-link' >{
                        event?.name
                    }</Link>
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default BadgeInfoModal