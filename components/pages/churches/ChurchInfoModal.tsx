import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../components/features/customscroll.css';
import { IChurch } from '@/lib/database/models/church.model';
import Link from 'next/link';

export type ChurchInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentChurch:IChurch|null,
    setCurrentChurch:Dispatch<SetStateAction<IChurch|null>>
}

const ChurchInfoModal = ({infoMode, setInfoMode, currentChurch, setCurrentChurch}:ChurchInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentChurch(null);
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
                    <Link href={`/dashboard/churches/${currentChurch?._id}`}  className='text-[1.3rem] font-bold text-blue-500 underline' >{currentChurch?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Pastor</span>
                    <span className='text-[0.9rem]' >{currentChurch?.pastor}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Location</span>
                    <span className='text-[0.9rem]' >{typeof currentChurch?.zoneId === 'object' && 'country' in currentChurch?.zoneId && currentChurch?.zoneId?.country}</span>
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Zone</span>
                    <Link href={{pathname:'/dashboard/zones', query:{id:typeof currentChurch?.zoneId === 'object' && '_id' in currentChurch?.zoneId && currentChurch?.zoneId?._id.toString()}}}   className='text-blue-700 underline cursor-pointer' >{typeof currentChurch?.zoneId === 'object' && 'name' in currentChurch?.zoneId && currentChurch?.zoneId?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Registrants</span>
                    <span className='text-[0.9rem]' >{currentChurch?.registrants}</span>
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Youth</span>
                    <span className='text-[0.9rem]' >{currentChurch?.youth}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Coordinators</span>
                    <span className='text-[0.9rem]' >{currentChurch?.coordinators}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Volunteers</span>
                    <span className='text-[0.9rem]' >{currentChurch?.volunteers}</span>
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default ChurchInfoModal