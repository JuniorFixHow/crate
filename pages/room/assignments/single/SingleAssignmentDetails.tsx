import { EventRegProps } from '@/types/Types'
import Link from 'next/link'
import React from 'react'

const SingleAssignmentDetails = ({data}:{data:EventRegProps}) => {
  return (
    <div className='flex flex-1 flex-col gap-6' >
        {
            data?.regType === 'Individual' ?
            <div className="flex flex-col gap-3">
                <span className='font-bold' >Member Info</span>
                <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                    <div className="flex">
                        <span className='text-[0.85rem] font-semibold flex flex-1' >Name:</span>
                        <Link href={`/dashboard/members/4`} className='table-link flex flex-1' >Member name</Link>
                    </div>
                    <div className="flex">
                        <span className='text-[0.85rem] font-semibold flex flex-1' >Email:</span>
                        <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Member email</span>
                    </div>
                    <div className="flex">
                        <span className='text-[0.85rem] font-semibold flex flex-1' >Phone number:</span>
                        <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Member phone number</span>
                    </div>
                    <div className="flex">
                        <span className='text-[0.85rem] font-semibold flex flex-1' >Status:</span>
                        <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Member status</span>
                    </div>
                </div>
            </div>
            :
            <div className="flex flex-col gap-3">
                <span className='font-bold' >Group Info</span>
                <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                    <div className="flex">
                        <span className='text-[0.85rem] font-semibold flex flex-1' >Group Name:</span>
                        <Link href={`/dashboard/groups/4`} className='table-link flex flex-1' >Group name</Link>
                    </div>
                    <div className="flex">
                        <span className='text-[0.85rem] font-semibold flex flex-1' >Group Number:</span>
                        <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Group number</span>
                    </div>
                    <div className="flex">
                        <span className='text-[0.85rem] font-semibold flex flex-1' >Type:</span>
                        <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Group Type</span>
                    </div>
                </div>
            </div>
        }

        <div className="flex flex-col gap-3">
            <span className='font-bold' >Room Info</span>
            <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                <div className="flex">
                    <span className='text-[0.85rem] font-semibold flex flex-1' >Venue:</span>
                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Room</span>
                </div>
                <div className="flex">
                    <span className='text-[0.85rem] font-semibold flex flex-1' >Floor:</span>
                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Floor</span>
                </div>
                <div className="flex">
                    <span className='text-[0.85rem] font-semibold flex flex-1' >Room Number:</span>
                    <Link href={{pathname:`/dashboard/rooms`, query:{id:'3'}}} className='table-link flex flex-1' >Room number</Link>
                </div>
                <div className="flex">
                    <span className='text-[0.85rem] font-semibold flex flex-1' >Room Type:</span>
                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Room type</span>
                </div>
                <div className="flex">
                    <span className='text-[0.85rem] font-semibold flex flex-1' >Bed Type:</span>
                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >Bed type</span>
                </div>
                <div className="flex">
                    <span className='text-[0.85rem] font-semibold flex flex-1' >No. of Beds:</span>
                    <span className='text-[0.85rem] font-semibold text-slate-400 flex flex-1' >4</span>
                </div>
            </div>
        </div>
        {
            data?.regType !=='Individual' &&
            <div className="flex flex-col gap-3">
                <span className='font-bold' >Group/Family Members</span>
                <div className="flex flex-col gap-2 ml-2 lg:ml-8">
                    {
                        [1,2,3,4].map((item)=>(
                            <div key={item} className="flex-center w-fit py-2 px-4 cursor-default bg-[#E5E9F3] dark:bg-black dark:border dark:text-white rounded text-[0.8rem]">
                                Member name
                            </div>
                        ))
                    }
                </div>
            </div>
        }
    </div>
  )
}

export default SingleAssignmentDetails