import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../../components/features/customscroll.css';
import Link from 'next/link';

import { IContract } from '@/lib/database/models/contract.model';

export type ContractInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentContract:IContract|null,
    setCurrentContract:Dispatch<SetStateAction<IContract|null>>
}

const ContractInfoModal = ({infoMode, setInfoMode, currentContract, setCurrentContract}:ContractInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentContract(null);
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
                    <Link href={`/dashboard/churches/contracts/${currentContract?._id}`}  className='text-[1.3rem] font-bold text-blue-500 underline' >{currentContract?.title}</Link>
                </div>
              
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Date of Commencement</span>
                    <span className='text-[0.9rem]' >{currentContract?.date?.from}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Date of Expiration</span>
                    <span className='text-[0.9rem]' >{currentContract?.date?.to}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Benefit</span>
                    <span className='text-[0.9rem]' >${currentContract?.amount}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Offeree</span>
                    <span className='text-[0.9rem]' >{currentContract?.offeree?.name}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Witness</span>
                    <span className='text-[0.9rem]' >{currentContract?.witness?.name}</span>
                </div>

                {
                    currentContract?.description &&
                    <div className="flex flex-col dark:text-slate-200 w-80">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Description</span>
                        <span className='text-[0.9rem] ' >{currentContract?.description}</span>
                    </div>
                }
                
                
            </div>
        </div>
    </Modal>
  )
}

export default ContractInfoModal