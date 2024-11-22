import React from 'react'
import { TbLivePhotoFilled } from "react-icons/tb";

const SessionContentTop = () => {
  return (
    <div className='flex flex-col rounded gap-2 bg-white border dark:bg-black px-1 pt-1 py-4' >
        <div className="flex flex-row items-center gap-4">
            <span className='font-semibold' >Attendance Overview</span>
            <TbLivePhotoFilled className='text-blue-700' />
            <div className="flex flex-row items-center gap-2">
                <span className='font-medium text-[0.8rem]' >Time:</span>
                <span className='font-medium text-[0.8rem] text-blue-700' >8:00AM - 6:30PM</span>
            </div>
            <div className="flex flex-row items-center gap-2">
                <span className='font-medium text-[0.8rem]' >Venue:</span>
                <span className='font-medium text-[0.8rem] text-blue-700' >8:00AM - 6:30PM</span>
            </div>
        </div>

        <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-col gap-1 pr-2 border-r-2">
                <span className='text-blue-700 font-medium' >3661</span>
                <span className='text-slate-500 text-[0.9rem] font-medium' >Total Registrants</span>
            </div>

            <div className="flex gap-10 border-r-2 flex-row items-center pr-2">
                <div className="flex flex-col gap-1">
                    <span className='text-blue-700 font-medium' >205<span className='text-slate-500' >(10%)</span></span>
                    <span className='text-slate-500 text-[0.9rem] font-medium' >Present</span>
                </div>

                <div className="flex flex-col gap-1">
                    <span className='text-blue-700 font-medium' >3456<span className='text-slate-500' >(90%)</span></span>
                    <span className='text-slate-500 text-[0.9rem] font-medium' >Absent</span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-blue-700 font-medium' >24</span>
                <span className='text-slate-500 text-[0.9rem] font-medium' >Most Recent</span>
            </div>
        </div>
    </div>
  )
}

export default SessionContentTop