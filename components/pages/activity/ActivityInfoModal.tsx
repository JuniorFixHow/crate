import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import '@/components/features/customscroll.css';
import Link from 'next/link';

import { IActivity } from '@/lib/database/models/activity.model';
import { IChurch } from '@/lib/database/models/church.model';
import { useFetchMinistries } from '@/hooks/fetch/useMinistry';
import { IMinistry } from '@/lib/database/models/ministry.model';

export type ActivityInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>
    currentActivity:IActivity|null,
    setCurrentActivity:Dispatch<SetStateAction<IActivity|null>>
}

const ActivityInfoModal = ({infoMode, setInfoMode, setCurrentActivity, currentActivity}:ActivityInfoModalProps) => {

    const church = currentActivity?.churchId as unknown as IChurch;
    const activityId =  currentActivity?._id as string;
    const ministries = useFetchMinistries(activityId)?.data as IMinistry[];

    const handleClose = ()=>{
        setCurrentActivity(null);
        setInfoMode(false);
    }
    
    

    if(!currentActivity) return null;
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
                    <Link href={`/dashboard/activities/${currentActivity?._id}`}   className='text-xl table-link' >{
                    currentActivity?.name
                    }</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Program</span>
                    <span className='text-[0.9rem]' >{currentActivity?.type}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Happening</span>
                    <span className='text-[0.9rem]' >{currentActivity?.frequency}</span>
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Commencement Date</span>
                    <span className='text-[0.9rem]' >{currentActivity?.startDate}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Ending Date</span>
                    <span className='text-[0.9rem]' >{currentActivity?.startDate}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Commencement Time</span>
                    <span className='text-[0.9rem]' >{currentActivity?.startTime}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Ending Time</span>
                    <span className='text-[0.9rem]' >{currentActivity?.endTime}</span>
                </div>
               
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Leaders</span>
                    {
                        currentActivity?.leaders?.length > 0 ?
                        <Link href={{pathname:`/dashboard/activities/${currentActivity?._id}`, query:{tab:'Leaders'}}}   className='text-[0.9rem] table-link' >{
                            currentActivity?.leaders?.length
                        }</Link>
                        :
                        <span className='text-[0.9rem]' >None</span> 
                    }
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Members</span>
                    {
                        currentActivity?.members?.length > 0 ?
                        <Link href={{pathname:`/dashboard/activities/${currentActivity?._id}`, query:{tab:'Members'}}}   className='text-[0.9rem] table-link' >{
                            currentActivity?.members?.length
                        }</Link>
                        :
                        <span className='text-[0.9rem]' >None</span> 
                    }
                </div>


                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Classes</span>
                    {
                        ministries?.length > 0 ?
                        <div className="flex flex-col gap-2">
                            {
                                ministries?.map((item)=>(
                                    <Link key={item?._id} href={{pathname:`/dashboard/activities/${currentActivity?._id}`, query:{classId:item?._id}}}   className='text-[0.9rem] table-link' >{
                                        item?.name
                                    }</Link>

                                ))
                            }
                        </div>
                        :
                        <span className='text-[0.9rem]' >None</span> 
                    }
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

export default ActivityInfoModal