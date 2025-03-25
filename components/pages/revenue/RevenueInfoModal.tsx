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
import { useAuth } from '@/hooks/useAuth'
import { canPerformAction, memberRoles, userRoles, eventRoles, zoneRoles, churchRoles, groupRoles } from '@/components/auth/permission/permission'

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
    const {user} = useAuth();
    const registration = currentRevenue?.payer as IRegistration;
    // const event = registration?.eventId as IEvent;
    const payee = currentRevenue?.payee as IVendor;
    const member = registration?.memberId as IMember;
    const church = member?.church as IChurch;
    const zone = church?.zoneId as IZone;
    const group = registration?.groupId as IGroup;
    const pchurch = currentRevenue?.churchId as IChurch;
    const pevent = currentRevenue?.eventId as IEvent;


    // const isAdmin = isSuperUser(user!) || isSystemAdmin.reader(user!);

    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const showUser = canPerformAction(user!, 'reader', {userRoles});
    const showEvent = canPerformAction(user!, 'reader', {eventRoles});
    const showZone = canPerformAction(user!, 'reader', {zoneRoles});
    const showChurch = canPerformAction(user!, 'reader', {churchRoles});
    const showGroup = canPerformAction(user!, 'reader', {groupRoles});


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
                    {
                        currentRevenue?.payer ?
                        <>
                        {
                            showMember ?
                            <Link href={`/dashboard/members/${member?._id}`}  className='table-link w-fit' >{member?.name}</Link>
                            :
                            <span   className='text-[0.9rem]' >{member?.name}</span> 
                        }
                        </>
                        :
                        <>
                        {
                          showChurch ?  
                          <Link href={{pathname:`/dashboard/churches`, query:{id:pchurch?._id}}}  className='table-link w-fit' >{pchurch?.name}</Link>
                          :
                          <span  className='text-[0.9rem]' >{pchurch?.name}</span>
                        }
                        </>
                    }
                </div>
                {
                    currentRevenue?.payer &&
                    <>
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Zone</span>
                        {
                            showZone ? 
                            <Link href={{pathname:`/dashboard/zones`, query:{id:zone?._id}}}  className='table-link w-fit' >{zone?.name}</Link>
                            :
                            <span  className='text-[0.9rem]' >{zone?.name}</span>
                        }
                    </div>
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Church</span>
                        {
                            showChurch ?
                            <Link href={{pathname:`/dashboard/churches`, query:{id:church?._id}}}  className='table-link w-fit' >{church?.name}</Link>
                            :
                            <span  className='text-[0.9rem]' >{church?.name}</span>
                        }
                    </div>
                    </>
                }
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Event</span>
                    {
                        showEvent ?
                        <Link href={`/dashboard/events/${pevent?._id}`}  className='table-link w-fit' >{pevent?.name}</Link>
                        :
                        <span  className='text-[0.9rem]' >{pevent?.name}</span>
                    }
                </div>

                {
                    currentRevenue?.payer &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Group</span>
                        {
                            group ?
                            <>
                            {
                                showGroup?
                                <Link href={`/dashboard/groups/${group?._id}`}  className='table-link w-fit' >{group?.name}</Link>
                                :
                                <span  className='text-[0.9rem]' >{group?.name}</span>
                            }
                            </>
                            :
                            <span className='text-[0.9rem]' >None</span>
                        }
                    </div>
                }
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Payment Purpose</span>
                    <span className='text-[0.9rem]' >{currentRevenue?.purpose}</span>
                </div>

                {
                    currentRevenue?.narration &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Narration</span>
                        <span className='text-[0.9rem]' >{currentRevenue?.narration}</span>
                    </div>
                }
                {
                    payee &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Received By</span>
                        {
                            showUser ?
                            <Link href={{pathname:`/dashboard/users`, query:{id:payee?._id}}}  className='table-link w-fit' >{payee?.name}</Link>
                            :
                            <span className='text-[0.9rem]' >{payee?.name}</span>
                        }
                    </div>
                }
                
            </div>
        </div>
    </Modal>
  )
}

export default RevenueInfoModal