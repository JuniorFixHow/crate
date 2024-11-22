import { EventRegProps } from '@/types/Types'
import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import '../customscroll.css';
import Link from 'next/link';

export type BadgeInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>
    currentEventReg:EventRegProps|null,
    setCurrentEventReg:Dispatch<SetStateAction<EventRegProps|null>>
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
                    <Link href={`/dashboard/members/${currentEventReg?.memberId}`}   className='text-[0.9rem] table-link' >Member Name</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Registration type</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.regType}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Chek-in status</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.status}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Badge Issued</span>
                    <span className='text-[0.9rem]' >{currentEventReg?.badgeIssued}</span>
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Group/Family</span>
                    {
                        currentEventReg?.regType === 'Individual' ?
                        <span className='text-[0.9rem]' >N/A</span> :
                        <Link href={`/dashboard/groups/${currentEventReg?.groupId}`}   className='text-[0.9rem] table-link' >Group Name/Number</Link>
                    }
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Room</span>
                    {
                        currentEventReg?.status === 'Pending' ?
                        <span className='text-[0.9rem]' >N/A</span>:
                        <Link href={`/dashboard/rooms/${currentEventReg?.roomId}`}   className='text-[0.9rem] table-link' >Room Name/Number</Link>
                    }
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    <Link href={`/dashboard/event/${currentEventReg?.eventId}`}   className='text-[0.9rem] table-link' >Event Name</Link>
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default BadgeInfoModal