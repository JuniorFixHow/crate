import Title from '@/components/features/Title'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import AssignmentTable from './AssignmentTable'

const AssignmentMain = () => {
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/rooms" text="Rooms" />
            <IoIosArrowForward/>
            <Title text="Room Assignments" />
        </div>
        <AssignmentTable/>
    </div>
  )
}

export default AssignmentMain