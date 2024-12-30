import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '@/components/features/customscroll.css';
import Link from 'next/link';
import { IVenue } from '@/lib/database/models/venue.model';

export type VenueInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentVenue:IVenue|null,
    setCurrentVenue:Dispatch<SetStateAction<IVenue|null>>
}

const VenueInfoModal = ({infoMode, setInfoMode, currentVenue, setCurrentVenue}:VenueInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentVenue(null);
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
                <div className="flex flex-col dark:text-slate-200">
                    <Link href={`/dashboard/venues/${currentVenue?._id}`}  className='text-[1.3rem] font-bold text-blue-500 underline' >{currentVenue?.name}</Link>
                </div>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Type</span>
                    <span className='text-[0.9rem]' >{currentVenue?.type}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Location</span>
                    <span className='text-[0.9rem]' >{currentVenue?.location}</span>
                </div>
                
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Facilities</span>
                    {
                        currentVenue?.facilities?.length ?
                        <Link href={{pathname:'/dashboard/venues/facilities', query:{venueId:currentVenue?._id}}}  className='table-link' >{currentVenue?.facilities.length}</Link>
                        :
                        <span className='text-[0.9rem]' >0</span>
                    }
                </div>
                
                
            </div>
        </div>
    </Modal>
  )
}

export default VenueInfoModal