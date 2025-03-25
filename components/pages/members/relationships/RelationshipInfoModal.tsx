import { isChurchAdmin, memberRoles } from '@/components/auth/permission/permission'
import { checkIfAdmin } from '@/components/Dummy/contants'
import { useAuth } from '@/hooks/useAuth'
import { IChurch } from '@/lib/database/models/church.model'
import { IMember } from '@/lib/database/models/member.model'
import { IRelationship } from '@/lib/database/models/relationship.model'
import { Modal } from '@mui/material'
import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'

export type RelationshipInfoModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentRelationship:IRelationship|null,
    noChurch?:boolean;
    setCurrentRelationship:Dispatch<SetStateAction<IRelationship|null>>
}

const RelationshipInfoModal = ({infoMode, noChurch, setInfoMode, currentRelationship, setCurrentRelationship}:RelationshipInfoModalProps) => {
    const church = currentRelationship?.churchId as IChurch;
    const members = currentRelationship?.members as IMember[];

    // const currentMember = members?.filter((member)=>member?._id ===)
    const {user} = useAuth();

    const handleClose = ()=>{
        setCurrentRelationship(null);
        setInfoMode(false);
    }
    if(!currentRelationship || !user) return;
    const isAdmin = checkIfAdmin(user);
    const showMember = isAdmin || isChurchAdmin.reader(user) || memberRoles.reader(user);
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
                    <span className='text-[1.3rem] font-bold' > {currentRelationship?.title || 'No title'}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Relationship</span>
                    <span className='text-[0.9rem]' >{currentRelationship?.type}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Member</span>
                    <Link href={`/dashboard/members/${members[0]?._id}`} className='table-link' >{members[0]?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Relations</span>
                    {
                        members?.slice(1).map((member)=>(
                            <>
                            {
                                showMember ?
                                <Link key={member?._id} href={`/dashboard/members/${member?._id}`} className='table-link' >{member?.name}</Link>
                                :
                                <span key={member?._id} className='text-[0.9rem]' >{member?.name}</span>
                            }
                            </>
                        ))
                    }
                    {/* <span className='text-[0.9rem]' >{currentRelationship?.relationshipType}</span> */}
                </div>
                {
                    !noChurch && isAdmin &&
                    <div className="flex flex-col dark:text-slate-200">
                        <span className='text-[1.1rem] font-semibold text-slate-700' >Church</span>
                        <Link href={{pathname:`/dashboard/churches`, query:{id:church?._id}}} className='table-link' >{church?.name}</Link>
                    </div>
                }
                
                
            </div>
        </div>
    </Modal>
  )
}

export default RelationshipInfoModal