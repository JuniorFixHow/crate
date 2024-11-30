'use client'
import Title from '@/components/features/Title'
import React, { useState } from 'react'
import GroupNumber from './GroupNumber'
import GroupTable from './GroupTable'

const GroupMain = () => {
  const [eventId, setEventId] = useState<string>('');
  return (
    <div className='page' >
      <Title text='Groups/Family' />
      <GroupNumber eventId={eventId} />
      <GroupTable eventId={eventId} setEventId={setEventId} />
    </div>
  )
}

export default GroupMain