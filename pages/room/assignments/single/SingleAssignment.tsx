import Title from '@/features/Title'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import SingleAssignmentContent from './SingleAssignmentContent'

const SingleAssignment = ({id}:{id:string}) => {
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/rooms" text="Rooms" />
            <IoIosArrowForward/>
            <Title clickable text="Room Assignments" link='/dashboard/rooms/assignments' />
            <IoIosArrowForward/>
            <Title text="Select" />
        </div>
        <SingleAssignmentContent id={id} />
    </div>
  )
}

export default SingleAssignment