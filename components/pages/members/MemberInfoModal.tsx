import { Modal } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from 'next/link';
import { IChurch } from '@/lib/database/models/church.model';
import { IMember } from '@/lib/database/models/member.model';
import { ICampuse } from '@/lib/database/models/campuse.model';
import { IZone } from '@/lib/database/models/zone.model';
import { IVendor } from '@/lib/database/models/vendor.model';
import Image from 'next/image';
import '../../features/customscroll.css';

export type MemberInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentMember:IMember|null,
    setCurrentMember:Dispatch<SetStateAction<IMember|null>>
}

const MemberInfoModal = ({infoMode, setInfoMode, currentMember, setCurrentMember}:MemberInfoModalProps) => {
    const church = currentMember?.church as IChurch;
    const campus = currentMember?.campuseId as ICampuse;
    const zone = church?.zoneId as IZone;
    const registerer = currentMember?.registeredBy as IVendor;
    const handleClose = ()=>{
        setCurrentMember(null);
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
                {
                    currentMember &&
                    <div className="flex-center w-full">
                        <div className="flex-center w-fit bg-slate-300 rounded-full p-2">
                            <div className="h-20 w-20 relative rounded-full">
                                <Image fill className='rounded-full' alt='member' src={currentMember!.photo} />
                            </div>
                        </div>
                    </div>
                }

                <div className="flex flex-col dark:text-slate-200">
                    <Link href={`/dashboard/members/${currentMember?._id}`}  className='text-[1.3rem] font-bold text-blue-500 underline' >{currentMember?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Gender</span>
                    <span className='text-[0.9rem]' >{currentMember?.gender}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Age Range</span>
                    <span className='text-[0.9rem]' >{currentMember?.gender}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Email</span>
                    <Link className='table-link' href={`mailto:${currentMember?.email}`} >{currentMember?.email}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Phone</span>
                    <span className='text-[0.9rem]' >{currentMember?.phone}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Marital Status</span>
                    <span className='text-[0.9rem]' >{currentMember?.marital}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Employment Status</span>
                    <span className='text-[0.9rem]' >{currentMember?.employ}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Membership Status</span>
                    <span className='text-[0.9rem]' >{currentMember?.status}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Dietary-specific</span>
                    <span className='text-[0.9rem]' >{currentMember?.dietary}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Allergies</span>
                    <span className='text-[0.9rem]' >{currentMember?.allergy? currentMember?.allergy : 'None'}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Zone</span>
                    <Link href={{pathname:`/dashboard/zones`, query:{id:zone?._id}}}  className='table-link' >{zone?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Church</span>
                    <Link href={{pathname:`/dashboard/churches`, query:{id:church?._id}}}  className='table-link' >{church?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Campus</span>
                    {
                        campus ? 
                        <Link href={{pathname:`/dashboard/churches/campuses`, query:{id:campus?._id}}}  className='table-link' >{campus?.name}</Link>
                        :
                        <span className='text-[0.9rem]' >None</span>
                    }
                </div>
                
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Notes</span>
                    <span className='text-[0.9rem]' >{currentMember?.note? currentMember?.note : 'None'}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Registered By</span>
                    <Link href={{pathname:`/dashboard/users`, query:{id:registerer?._id}}}  className='table-link' >{registerer?.name}</Link>
                </div>
                
                
                
            </div>
        </div>
    </Modal>
  )
}

export default MemberInfoModal