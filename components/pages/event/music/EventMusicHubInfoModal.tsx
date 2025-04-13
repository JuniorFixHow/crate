import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../../components/features/customscroll.css';
import Link from 'next/link';
import { IMusichub } from '@/lib/database/models/musichub.model';



export type EventMusichubInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentHub:IMusichub|null,
    setCurrentHub:Dispatch<SetStateAction<IMusichub|null>>;
}

const EventMusichubInfoModal = ({infoMode,   setInfoMode, currentHub, setCurrentHub}:EventMusichubInfoModalProps) => {

    

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
                    <span   className='text-[1.3rem] font-bold' >{currentHub?.title}</span>
                </div>
                {
                    currentHub?.contact &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Contact</span>
                        <span className='text-[0.9rem]' >{currentHub?.contact}</span>
                    </div>
                }
                {
                    currentHub?.email &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Email</span>
                        <Link target='_blank' href={`mailto:${currentHub?.email}`} className='table-link' >{currentHub?.email}</Link>
                    </div>
                }
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Type</span>
                    <span className='text-[0.9rem]' >{currentHub?.type}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Nature</span>
                    <span className='text-[0.9rem]' >{currentHub?.nature}</span>
                </div>                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Appearance</span>
                    <span className='text-[0.9rem]' >{currentHub?.appearance}</span>
                </div> 

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Affiliation</span>
                    <span className='text-[0.9rem]' >{currentHub?.affiliation}</span>
                </div>                                   
            </div>
            
        </div>
    </Modal>
  )
}

export default EventMusichubInfoModal