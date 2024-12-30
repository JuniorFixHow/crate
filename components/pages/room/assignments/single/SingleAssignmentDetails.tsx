import { IFacility } from '@/lib/database/models/facility.model'
import { IGroup } from '@/lib/database/models/group.model'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IRoom } from '@/lib/database/models/room.model'
import { IVenue } from '@/lib/database/models/venue.model'
import { LinearProgress } from '@mui/material'
import Link from 'next/link'
import React from 'react'

type SingleAssignmentDetailsProps = {
    type:string|null,
    GroupData:IGroup,
    MemberData:IRegistration,
    loading:boolean,
    currentRoom:IRoom
}

const SingleAssignmentDetails = ({type, loading, GroupData, currentRoom, MemberData}:SingleAssignmentDetailsProps) => {
    const venue = currentRoom?.venueId as IVenue;
    const facility = currentRoom?.facId as IFacility;

  return (
    <div className='flex flex-1 flex-col gap-6' >
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
                                <Link href={`/dashboard/members/${typeof MemberData.memberId === 'object' && '_id' in MemberData.memberId && MemberData.memberId?._id}`} className='table-link flex flex-1' >{typeof MemberData.memberId === 'object' && 'name' in MemberData.memberId && MemberData.memberId?.name}</Link>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Email:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{typeof MemberData.memberId === 'object' && 'email' in MemberData.memberId && MemberData.memberId?.email}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Phone number:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{typeof MemberData.memberId === 'object' && 'phone' in MemberData.memberId && MemberData?.memberId?.phone}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Status:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{typeof MemberData?.memberId === 'object' && 'status' in MemberData.memberId && MemberData?.memberId?.status}</span>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col gap-3">
                        <span className='font-bold' >Group Info</span>
                        <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Group Name:</span>
                                <Link href={`/dashboard/groups/${GroupData?._id}`} className='table-link flex flex-1' >{GroupData?.name}</Link>
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
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{ `${venue} - ${currentRoom?.number}`}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Floor:</span>
                                <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >{facility?.floor}</span>
                            </div>
                            <div className="flex">
                                <span className='text-[0.85rem] font-semibold flex flex-1' >Room Number:</span>
                                <Link href={{pathname:`/dashboard/rooms`, query:{id:currentRoom?._id}}} className='table-link flex flex-1' >{currentRoom?.number}</Link>
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
                                GroupData.members.map((item)=>(
                                    <div key={typeof item === 'object' && '_id' in item ? item._id.toString() : ''} className="flex-center w-fit py-2 px-4 cursor-default bg-[#E5E9F3] dark:bg-black dark:border dark:text-white rounded text-[0.8rem]">
                                        {typeof item === 'object' && 'name' in item && item?.name}
                                    </div>
                                ))
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