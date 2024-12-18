import Title from '@/components/features/Title'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import RoomSummaryTable from './RoomSummaryTable'

const RoomSummaryMain = () => {
  return (
    <div className='page' >
         <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/rooms" text="Rooms" />
            <IoIosArrowForward/>
            <Title text="Registration Summary" />
        </div>
        <RoomSummaryTable/>
    </div>
  )
}

export default RoomSummaryMain