'use client'
import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../components/features/customscroll.css';
import Image from 'next/image';
import Link from 'next/link';
import AddButton from '@/components/features/AddButton';
import DeleteDialog from '@/components/DeleteDialog';
import { IVendor } from '@/lib/database/models/vendor.model';

export type VendorInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentVendor:IVendor|null,
    setCurrentVendor:Dispatch<SetStateAction<IVendor|null>>
}

const VendorInfoModal = ({infoMode, setInfoMode, currentVendor, setCurrentVendor}:VendorInfoModalProps) => {

    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const handleClose = ()=>{
        setCurrentVendor(null);
        setInfoMode(false);
    }
    const message = `You're about to reset the password for ${currentVendor?.name}. Continue?`
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

            <DeleteDialog title='Reset Password' message={message} value={deleteMode} setValue={setDeleteMode} onTap={async()=>{}} />
            <div className="flex flex-col gap-4">
                <div className="flex flex-row dark:text-slate-200 gap-4 items-center">
                    <div className="flex-center w-20 h-20 relative">
                        <Image src={currentVendor ? currentVendor?.image:''} fill className='rounded-full' alt='vendor' />
                    </div>
                    <span className='text-[1.3rem] font-bold' >{currentVendor?.name}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Email</span>
                    <Link href={`mailto:${currentVendor?.email}`} target='_blank'  className='text-[0.9rem] table-link' >{currentVendor?.email}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Phone</span>
                    <span className='text-[0.9rem]' >{currentVendor?.phone}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Gender</span>
                    <span className='text-[0.9rem]' >{currentVendor?.gender}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Role</span>
                    <span className='text-[0.9rem]' >{currentVendor?.role}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Country</span>
                    <span className='text-[0.9rem]' >USA</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Zone</span>
                    <span className='text-[0.9rem]' >Zone B</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Church</span>
                    <span className='text-[0.9rem]' >{typeof currentVendor?.church === 'object' &&  'name' in currentVendor.church &&  currentVendor.church.name}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Registered Members</span>
                    <Link href={{pathname:'/dashboard/members', query:{registeredBy:currentVendor?._id}}}  className='text-blue-700 underline cursor-pointer' >{currentVendor?.registrants}</Link>
                </div>
                
            </div>
            <AddButton onClick={()=>setDeleteMode(true)} text='Reset Password' className='rounded mt-8 justify-center' isDanger noIcon smallText />
        </div>
    </Modal>
  )
}

export default VendorInfoModal