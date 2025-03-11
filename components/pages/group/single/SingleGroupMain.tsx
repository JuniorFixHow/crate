import Title from '@/components/features/Title'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import SingleGroupTable from './SingleGroupTable'
import { IGroup } from '@/lib/database/models/group.model'

const SingleGroupMain = ({group}:{group:IGroup}) => {
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/groups" text="Groups/Family" />
          <IoIosArrowForward/>
          <Title text="Edit Group" />
        </div>
        <SingleGroupTable currentGroup={group} />
    </div>
  )
}

export default SingleGroupMain