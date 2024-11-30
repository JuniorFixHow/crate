import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import '../customscroll.css';
import Link from 'next/link';
import { IRegistration } from '@/lib/database/models/registration.model';

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
                    <Link href={`/dashboard/members/${typeof currentEventReg?.memberId === 'object' && '_id' in currentEventReg.memberId && currentEventReg?.memberId._id}`}   className='text-[0.9rem] table-link' >{
                    typeof currentEventReg?.memberId === 'object' && 'name' in currentEventReg.memberId && currentEventReg?.memberId.name
                    }</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Registration type</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.groupId ? 
                    typeof currentEventReg.groupId === 'object' && 'type' in currentEventReg.groupId && currentEventReg?.groupId.type
                    :
                    'Individual'
                    }</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Chek-in status</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.roomIds?.length === 0 ? 'Pending':'Checked-in'}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Badge Issued</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.badgeIssued}</span>
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Group/Family</span>
                    {
                        currentEventReg?.groupId ?
                        <Link href={`/dashboard/groups/${typeof currentEventReg?.groupId === 'object' && '_id' in currentEventReg.groupId && currentEventReg?.groupId._id}`}   className='text-[0.9rem] table-link' >{
                            typeof currentEventReg?.groupId === 'object' && 'name' in currentEventReg.groupId && currentEventReg?.groupId.name
                        }</Link>
                        :
                        <span className='text-[0.9rem]' >N/A</span> 
                    }
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Room</span>
                    {
                        currentEventReg?.roomIds?.length  === 0 ?
                        <span className='text-[0.9rem]' >N/A</span>:
                        typeof currentEventReg?.roomIds?.[0] === 'object' && '_id' in currentEventReg?.roomIds?.[0] && currentEventReg?.roomIds.map((item)=>(
                            <Link key={typeof  item === 'object' && '_id' in item ? item?._id.toString():''} href={{pathname:`/dashboard/rooms`, query:{id:typeof  item === 'object' && '_id' in item && item?._id.toString()}}}   className='text-[0.9rem] table-link' >{
                                typeof item === 'object' && 'number' in item && item.number
                            }</Link>   
                        ))
                    }
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    <Link href={`/dashboard/events/${typeof currentEventReg?.eventId === 'object' && '_id' in currentEventReg.eventId && currentEventReg?.eventId._id}`}   className='text-[0.9rem] dark:text-white table-link' >{
                        typeof currentEventReg?.eventId === 'object' && 'name' in currentEventReg.eventId && currentEventReg?.eventId.name
                    }</Link>
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default BadgeInfoModal