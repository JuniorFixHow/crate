import {  Modal } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../components/features/customscroll.css';
import { IChurch } from '@/lib/database/models/church.model';
import Link from 'next/link';
import { IContract } from '@/lib/database/models/contract.model';
import AddButton from '@/components/features/AddButton';
// import { ErrorProps } from '@/types/Types';
import { unlicenseChurch } from '@/lib/actions/church.action';
import DeleteDialog from '@/components/DeleteDialog';
import { ICampuse } from '@/lib/database/models/campuse.model';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { IZone } from '@/lib/database/models/zone.model';

export type ChurchInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentChurch:IChurch|null,
    setCurrentChurch:Dispatch<SetStateAction<IChurch|null>>;
    reader:boolean;
    creator:boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IChurch[], Error>>
}

const ChurchInfoModal = ({infoMode, setInfoMode, creator, refetch, reader, currentChurch, setCurrentChurch}:ChurchInfoModalProps) => {
    const contract = currentChurch?.contractId as IContract;
    const campuses = currentChurch?.campuses as ICampuse[];
    // const [response, setResponse] = useState<ErrorProps>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const zone = currentChurch?.zoneId as IZone;
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const handleClose = ()=>{
        setCurrentChurch(null);
        setInfoMode(false);
    }

    const handleUnlicense = async()=>{
        // setResponse(null);
        try {
            setLoading(true);
            const res = await unlicenseChurch(currentChurch!._id);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            // setResponse(res);
            setDeleteMode(false);
            refetch();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured. Please retry', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }

    const message = `This will make the church unlicensed. Proceed?`;

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
                    {
                        reader ?
                        <Link href={`/dashboard/churches/${currentChurch?._id}`}  className='text-[1.3rem] font-bold text-blue-500 underline' >{currentChurch?.name}</Link>
                        :
                        <span  className='text-[1.3rem]' >{currentChurch?.name}</span>
                    }
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
                    {
                        reader ?
                        <Link href={{pathname:'/dashboard/zones', query:{id:zone?._id}}}   className='text-blue-700 underline cursor-pointer' >{zone?.name}</Link>
                        :
                        <span className='text-[0.9rem]' >{zone?.name}</span>
                    }
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

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Campuses</span>
                    <div className="flex flex-col gap-3">
                        {
                            campuses?.length > 0 ? campuses.map((item)=>(
                                <>
                                {
                                    reader ?
                                    <Link key={item?._id}  className='table-link' href={{pathname: `/dashboard/churches/campuses`, query:{id:item?._id}}} >{item?.name}</Link>
                                    :
                                    <span key={item?._id}  className='text-[0.9rem]'>{item?.name}</span>
                                }
                                </>
                            ))
                            :
                            <span className='text-[0.9rem]' >None</span>
                        }
                    </div>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Contract</span>
                    {
                        contract ?
                        <>
                        {
                            reader ?
                            <Link className='table-link' href={`/dashboard/churches/contracts/${contract?._id}`} >{contract?.title}</Link>
                            :
                            <span className='text-[0.9rem]'>{contract?.title}</span>
                        }
                        </>
                        :
                        <span className='text-[0.9rem]' >None</span>
                    }
                </div>
                <DeleteDialog title={`Unlicense ${currentChurch?.name}`} message={message} value={deleteMode} setValue={setDeleteMode} onTap={handleUnlicense} />
                

                {
                    contract && creator &&
                    <AddButton text={loading ? 'loading...':'Unlicense'} type='button' onClick={()=>setDeleteMode(true)} noIcon smallText isDanger className='rounded flex-center' />
                }
            </div>
        </div>
    </Modal>
  )
}

export default ChurchInfoModal