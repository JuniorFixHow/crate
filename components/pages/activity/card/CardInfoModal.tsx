import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import '@/components/features/customscroll.css';
import Link from 'next/link';

import { ICard } from '@/lib/database/models/card.model';
import { IChurch } from '@/lib/database/models/church.model';
import { IMember } from '@/lib/database/models/member.model';

export type CardInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentCard:ICard|null,
    setCurrentCard:Dispatch<SetStateAction<ICard|null>>
}

const CardInfoModal = ({infoMode, setInfoMode, setCurrentCard, currentCard}:CardInfoModalProps) => {

    const church = currentCard?.churchId as unknown as IChurch;
    const member = currentCard?.member as unknown as IMember;

    const handleClose = ()=>{
        setCurrentCard(null);
        setInfoMode(false);
    }
    
    

    if(!currentCard) return null;
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

            <div className="flex flex-col gap-4">
                
                <div className="flex flex-col dark:text-slate-200">                    
                    <Link href={`/dashboard/activities/${currentCard?._id}`}   className='text-xl table-link' >{
                    currentCard?.name
                    }</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Program</span>
                    <span className='text-[0.9rem]' >{currentCard?.type}</span>
                </div>
                {/* <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Happening</span>
                    <span className='text-[0.9rem]' >{currentCard?.frequency}</span>
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Commencement Date</span>
                    <span className='text-[0.9rem]' >{currentCard?.startDate}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Ending Date</span>
                    <span className='text-[0.9rem]' >{currentCard?.startDate}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Commencement Time</span>
                    <span className='text-[0.9rem]' >{currentCard?.startTime}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Ending Time</span>
                    <span className='text-[0.9rem]' >{currentCard?.endTime}</span>
                </div>
               
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Leaders</span>
                    {
                        currentCard?.leaders?.length > 0 ?
                        <Link href={{pathname:`/dashboard/activities/${currentCard?._id}`, query:{tab:'Leaders'}}}   className='text-[0.9rem] table-link' >{
                            currentCard?.leaders?.length
                        }</Link>
                        :
                        <span className='text-[0.9rem]' >None</span> 
                    }
                </div> */}

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Member</span>
                    <Link href={{pathname:`/dashboard/members/${member?._id}`, }}   className='text-[0.9rem] table-link' >{
                        member?.name
                    }</Link>
                    
                </div>

                

                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Church</span>
                    <Link href={{pathname:`/dashboard/churches`, query:{id:church?._id}}}   className='text-[0.9rem] dark:text-white table-link' >{
                        church?.name
                    }</Link>
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default CardInfoModal