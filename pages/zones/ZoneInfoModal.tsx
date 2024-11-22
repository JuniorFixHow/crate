import { ZoneProps } from '@/types/Types'
import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../features/customscroll.css';

export type ZoneInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentZone:ZoneProps|null,
    setCurrentZone:Dispatch<SetStateAction<ZoneProps|null>>
}

const ZoneInfoModal = ({infoMode, setInfoMode, currentZone, setCurrentZone}:ZoneInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentZone(null);
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
                    <span className='text-[1.3rem] font-bold' >{currentZone?.name}</span>
                </div>
                
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Country</span>
                    <span className='text-[0.9rem]' >{currentZone?.country}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >State/Region</span>
                    <span className='text-[0.9rem]' >{currentZone?.state}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Churches</span>
                    <span className='text-[0.9rem]' >{currentZone?.churches}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Registrants</span>
                    <span >{currentZone?.registrants}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Groups/Family</span>
                    <span className='text-[0.9rem]' >{currentZone?.groups}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Coordinators</span>
                    <span className='text-[0.9rem]' >{currentZone?.coordinators}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Volunteers</span>
                    <span className='text-[0.9rem]' >{currentZone?.volunteers}</span>
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default ZoneInfoModal