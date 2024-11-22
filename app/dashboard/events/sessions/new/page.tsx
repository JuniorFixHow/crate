import Title from '@/features/Title'
import NewSessions from '@/pages/session/NewSessions'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'

const page = () => {
  return (
    <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
         <div className="flex flex-row items-baseline gap-2">
            <Title clickable link='/dashboard/events/sessions' text='Sessions' />
            <IoIosArrowForward/>
            <Title text='New Session' />
        </div>
        <NewSessions/>
    </div>
  )
}

export default page