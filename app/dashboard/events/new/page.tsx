import Title from '@/components/features/Title'
import MainNewEvent from '@/components/pages/event/new/MainNewEvent'
import React from 'react'
import {IoIosArrowForward} from 'react-icons/io'

const page = () => {
  return (
    <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
      <div className="flex flex-row items-baseline gap-2">
        <Title clickable link='/dashboard/events' text='Events' />
        <IoIosArrowForward/>
        <Title text='New Event' />
      </div>
    
      <MainNewEvent/>
  </div>
  )
}

export default page