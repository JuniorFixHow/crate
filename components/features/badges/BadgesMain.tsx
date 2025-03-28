'use client'
import React, { useEffect, useState } from 'react'
import Title from '../Title'
import BadgeTop from './BadgeTop'
import BadgesTable from '@/components/tables/BadgesTable'
import { useAuth } from '@/hooks/useAuth'
import { canPerformAction, canPerformEvent, eventOrganizerRoles, eventRegistrationRoles } from '@/components/auth/permission/permission'
import { useRouter } from 'next/navigation'

const BadgesMain = () => {
    const [eventId, setEventId] = useState<string>('');
    const {user} = useAuth();
    const router = useRouter();

    const reader = canPerformAction(user!, 'reader', {eventRegistrationRoles}) || canPerformEvent(user!, 'reader', {eventOrganizerRoles});
    useEffect(()=>{
      if(user && !reader){
        router.replace('/dashboard/forbidden?p=Event Registation Reader')
      }
    },[reader, user, router])

    if(!reader) return;

  return (
    <div className='page' >
        <Title text='Registrations' />
        <BadgeTop eventId={eventId} setEventId={setEventId} />
        <BadgesTable setEventId={setEventId} eventId={eventId} />
    </div>
  )
}

export default BadgesMain