import Title from '@/features/Title'
import EventsTable from '@/tables/EventsTable'
import React from 'react'

const page = () => {
  return (
    <div className='flex w-full flex-col gap-6 p-4 pl-8 xl:pl-4' >
      <Title text='Events' />
      <EventsTable/>
    </div>
  )
}

export default page