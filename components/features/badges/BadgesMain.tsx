'use client'
import React, { useState } from 'react'
import Title from '../Title'
import BadgeTop from './BadgeTop'
import BadgesTable from '@/components/tables/BadgesTable'

const BadgesMain = () => {
    const [eventId, setEventId] = useState<string>('')

  return (
    <div className='page' >
        <Title text='Badges' />
        <BadgeTop eventId={eventId} setEventId={setEventId} />
        <BadgesTable setEventId={setEventId} eventId={eventId} />
    </div>
  )
}

export default BadgesMain