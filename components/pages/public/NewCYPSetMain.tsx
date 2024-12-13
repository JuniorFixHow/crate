import React from 'react'
import NewCYPSet from './NewCYPSet'
import Title from '@/components/features/Title'
import { IoIosArrowForward } from 'react-icons/io'

const NewCYPSetMain = () => {
  return (
    <div className='page' >
      <div className="flex flex-row gap-2 items-baseline">
        <Title clickable link="/dashboard/events/public" text="Public" />
        <IoIosArrowForward/>
        <Title text="New Public Set" />
      </div>
      <NewCYPSet/>
    </div>
  )
}

export default NewCYPSetMain
