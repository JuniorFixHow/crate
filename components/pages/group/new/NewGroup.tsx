import Title from '@/components/features/Title'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import NewGroupTable from './NewGroupTable'

const NewGroup = () => {
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/groups" text="Groups/Family" />
          <IoIosArrowForward/>
          <Title text="New Group" />
        </div>
        <NewGroupTable/>
    </div>
  )
}

export default NewGroup