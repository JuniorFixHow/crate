import { Modal } from '@mui/material'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../../../components/features/customscroll.css';
import Link from 'next/link';
import { NewServiceProps } from './NewService';
import { useEffect, useState } from 'react';
import { IContract } from '@/lib/database/models/contract.model';
import { getContractsByService } from '@/lib/actions/service.action';



const ServiceInfoModal = ({infoMode, setInfoMode, currentService, setCurrentService}:NewServiceProps) => {

    const [contracts, setContracts] = useState<IContract[]>([]);

    useEffect(()=>{
        const fetchContracts = async()=>{
            if(currentService){
                const conts = await getContractsByService(currentService?._id)
                setContracts(conts);
            }
        }
        fetchContracts()
    },[currentService])

    const handleClose = ()=>{
        setCurrentService(null);
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
                    <span   className='text-[1.3rem] font-bold' >{currentService?.name}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Cost</span>
                    <span className='text-[0.9rem]' >${currentService?.cost}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200 max-w-80">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Description</span>
                    <span className='text-[0.9rem]' >{currentService?.description}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Contracts</span>
                    <div className="flex flex-col gap-3">
                        {
                            contracts.length > 0 ?
                            contracts.map((contract)=>(
                                <Link key={contract._id} className='table-link' href={`/dashboard/churches/contracts/${contract?._id}`} >{contract?.title}</Link>
                                
                            ))
                            :
                            <span className='text-[0.9rem]' >None</span>
                        }
                    </div>
                </div>
                            
            </div>
        </div>
    </Modal>
  )
}

export default ServiceInfoModal