import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../../components/features/customscroll.css';
import Link from 'next/link';
import { ICampuse } from '@/lib/database/models/campuse.model';
import { IChurch } from '@/lib/database/models/church.model';

export type CampusInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentCampus:ICampuse|null,
    setCurrentCampus:Dispatch<SetStateAction<ICampuse|null>>
}

const CampusInfoModal = ({infoMode, setInfoMode, currentCampus, setCurrentCampus}:CampusInfoModalProps) => {
    const church = currentCampus?.churchId as IChurch;
    const handleClose = ()=>{
        setCurrentCampus(null);
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
                    <span   className='text-[1.3rem] font-bold' >{currentCampus?.name}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Type</span>
                    <span className='text-[0.9rem]' >{currentCampus?.type}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Church</span>
                    <Link href={{pathname:`/dashbord/churches`, query:{id:church?._id}}}  className='table-link' >{church?.name}</Link>
                </div>
                
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Members</span>
                    {
                        currentCampus?.members?.length ?
                        <Link href={{pathname:'/dashboard/members', query:{campuseId:currentCampus?._id}}}  className='table-link' >{currentCampus?.members.length}</Link>
                        :
                        <span className='text-[0.9rem]' >0</span>
                    }
                </div>
                
                
            </div>
        </div>
    </Modal>
  )
}

export default CampusInfoModal