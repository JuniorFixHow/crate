import { IEvent } from '@/lib/database/models/event.model'
import { IFacility } from '@/lib/database/models/facility.model'
import { IRoom } from '@/lib/database/models/room.model'
import { Modal } from '@mui/material'
import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'

export type SingleVenueRoomInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentRoom:IRoom|null,
    setCurrentRoom:Dispatch<SetStateAction<IRoom|null>>;
    eventReader:boolean;
}

const SingleVenueRoomInfoModal = ({infoMode, setInfoMode, eventReader, currentRoom, setCurrentRoom}:SingleVenueRoomInfoModalProps) => {
    const facility = currentRoom?.facId as IFacility;
    const event = currentRoom?.eventId as IEvent;

    const handleClose = ()=>{
        setCurrentRoom(null);
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
                    <span className='text-[1.3rem] font-bold' >{facility?.name} {currentRoom?.number}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Floor</span>
                    <span className='text-[0.9rem]' >{currentRoom?.floor}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Room Number</span>
                    <span className='text-[0.9rem]' >{currentRoom?.number}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Room Type</span>
                    <span className='text-[0.9rem]' >{currentRoom?.roomType}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Bed Type</span>
                    <span className='text-[0.9rem]' >{currentRoom?.bedType}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Number of Beds</span>
                    <span className='text-[0.9rem]' >{currentRoom?.nob}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Extra Features</span>
                    <span className='text-[0.9rem]' >{currentRoom?.features ? currentRoom?.features : 'None'}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    {
                        eventReader ?
                        <Link className='table-link' href={`/dashboard/events/${event?._id}`} >{event?.name}</Link>
                        :
                        <span className='text-[0.9rem]' >{currentRoom?.nob}</span>
                    }
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default SingleVenueRoomInfoModal