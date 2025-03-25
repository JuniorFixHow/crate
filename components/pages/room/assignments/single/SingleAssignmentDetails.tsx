import { canPerformAction, isSystemAdmin, isChurchAdmin, isSuperUser, roomRolesExtended, groupRoles, memberRoles, roomRoles } from '@/components/auth/permission/permission'
import { useAuth } from '@/hooks/useAuth'
import { IFacility } from '@/lib/database/models/facility.model'
import { IGroup } from '@/lib/database/models/group.model'
import { IMember } from '@/lib/database/models/member.model'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IRoom } from '@/lib/database/models/room.model'
import { IVenue } from '@/lib/database/models/venue.model'
import { LinearProgress } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComponentProps, useEffect } from 'react'

type SingleAssignmentDetailsProps = {
    type:string|null,
    GroupData:IGroup,
    MemberData:IRegistration,
    loading:boolean,
    currentRoom:IRoom
} & ComponentProps<'div'>

const SingleAssignmentDetails = ({type, className, loading, GroupData, currentRoom, MemberData, ...props}:SingleAssignmentDetailsProps) => {
    const venue = currentRoom?.venueId as IVenue;
    const facility = currentRoom?.facId as IFacility;

    const member = MemberData?.memberId as IMember;
    const members  = GroupData?.members as IMember[];

    const router = useRouter();

    const {user} = useAuth();
    const groupReader = canPerformAction(user!, 'reader', {groupRoles});
    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const showRoom = canPerformAction(user!, 'reader', {roomRoles});
    const roomAssign = isSystemAdmin.creator(user!) || isChurchAdmin.creator(user!) || isSuperUser(user!) || roomRolesExtended.assign(user!);

    useEffect(()=>{
        if(user && !roomAssign){
            router.replace('/dashboard/forbidden?p=Room Assigner');
        }
    },[roomAssign, user, router])

    if(!roomAssign) return;

  return (
    <div {...props}  className={`flex w-1/2 flex-col gap-6 ${className}`} >
        {
            loading ?
            <LinearProgress className='w-full' />
            :
            <>
                {
                    type === 'Member' ?
                    <div className="flex flex-col gap-3">
                        <span className='font-bold' >Member Info</span>
                        <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Name:</span>
                                {
                                    showMember ?
                                    <Link href={`/dashboard/members/${member?._id}`} className='table-link flex flex-1' >{member?.name}</Link>
                                    :
                                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{member?.name}</span>
                                }
                            </div>
                            {
                                member?.email &&
                                <div className="flex">
                                    <span className='text-[0.85rem] font-semibold flex flex-1' >Email:</span>
                                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{member?.email}</span>
                                </div>
                            }
                            {
                                member?.phone &&
                                <div className="flex">
                                    <span className='text-[0.85rem] font-semibold flex flex-1' >Phone number:</span>
                                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{member?.phone}</span>
                                </div>
                            }
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Status:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{member?.status}</span>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col gap-3">
                        <span className='font-bold' >Group Info</span>
                        <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Group Name:</span>
                                {
                                    groupReader ?
                                    <Link href={`/dashboard/groups/${GroupData?._id}`} className='table-link flex flex-1' >{GroupData?.name}</Link>
                                    :
                                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{GroupData?.name}</span>
                                }
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Group Number:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{GroupData?.groupNumber}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Type:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{GroupData?.type}</span>
                            </div>
                        </div>
                    </div>
                }

                {
                    type === 'Member' && currentRoom &&
                    <div className="flex flex-col gap-3">
                        <span className='font-bold' >Room Info</span>
                        <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Venue:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{ `${venue?.name} - ${currentRoom?.number}`}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Floor:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{facility?.floor}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Room Number:</span>
                                {
                                    showRoom ?
                                    <Link href={{pathname:`/dashboard/rooms`, query:{id:currentRoom?._id}}} className='table-link flex flex-1' >{currentRoom?.number}</Link>
                                    :
                                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{currentRoom?.number}</span>
                                }
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Room Type:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{currentRoom?.roomType}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Bed Type:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{currentRoom?.bedType}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >No. of Beds:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{currentRoom?.nob}</span>
                            </div>
                        </div>
                    </div>
                }

                {
                    type ==='Group' &&
                    <div className="flex flex-col gap-3">
                        <span className='font-bold' >Group/Family Members</span>
                        <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                            {
                                members.map((item)=>{
                                    return(
                                        <div key={item?._id} className="flex-center w-fit py-2 px-4 cursor-default bg-[#E5E9F3] dark:bg-black dark:border dark:text-white rounded text-[0.8rem]">
                                            {item?.name}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </>
        }
    </div>
  )
}

export default SingleAssignmentDetails