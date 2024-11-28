import Title from '@/components/features/Title'
import EventsTable from '@/components/tables/EventsTable'
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