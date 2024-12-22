import { IChurch } from '@/lib/database/models/church.model'
import { IEvent } from '@/lib/database/models/event.model'
import { IMember } from '@/lib/database/models/member.model'
import { IPayment } from '@/lib/database/models/payment.model'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IVendor } from '@/lib/database/models/vendor.model'
import { IZone } from '@/lib/database/models/zone.model'
import { Modal } from '@mui/material'
import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { monthFirstDate } from './fxn'
import { IGroup } from '@/lib/database/models/group.model'

export type RevenueInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentRevenue:IPayment|null,
    setCurrentRevenue:Dispatch<SetStateAction<IPayment|null>>
}

const RevenueInfoModal = ({infoMode, setInfoMode, currentRevenue, setCurrentRevenue}:RevenueInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentRevenue(null);
        setInfoMode(false);
    }
    const registration = currentRevenue?.payer as IRegistration;
    const event = registration?.eventId as IEvent;
    const payee = currentRevenue?.payee as IVendor;
    const member = registration?.memberId as IMember;
    const church = member?.church as IChurch;
    const zone = church?.zoneId as IZone;
    const group = registration?.groupId as IGroup;
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
                    <span className='text-[1.3rem] font-bold' >${currentRevenue?.amount}</span>
                </div>
                {
                    currentRevenue &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Paid On</span>
                        <span className='text-[0.9rem]' >{monthFirstDate(currentRevenue?.createdAt)}</span>
                    </div>
                }
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Paid By</span>
                    <Link href={`/dashboard/members/${member?._id}`}  className='table-link w-fit' >{member?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Zone</span>
                    <Link href={{pathname:`/dashboard/zones`, query:{id:zone?._id}}}  className='table-link w-fit' >{zone?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Church</span>
                    <Link href={{pathname:`/dashboard/churches`, query:{id:church?._id}}}  className='table-link w-fit' >{church?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    <Link href={`/dashboard/events/${event?._id}`}  className='table-link w-fit' >{event?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Group</span>
                    {
                        group ?
                        <Link href={`/dashboard/groups/${group?._id}`}  className='table-link w-fit' >{group?.name}</Link>
                        :
                        <span className='text-[0.9rem]' >None</span>
                    }
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Payment Purpose</span>
                    <span className='text-[0.9rem]' >{currentRevenue?.purpose}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Received By</span>
                    <Link href={{pathname:`/dashboard/users`, query:{id:payee?._id}}}  className='table-link w-fit' >{payee?.name}</Link>
                </div>
                
            </div>
        </div>
    </Modal>
  )
}

export default RevenueInfoModal