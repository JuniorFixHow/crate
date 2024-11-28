import SessionContentTop from '@/components/features/sessions/SessionContentTop'
import AttendanceTable from '@/components/tables/AttendanceTable'
import { ISession } from '@/lib/database/models/session.model'
import React from 'react'

type SessionContentProps = {
  currentSession:ISession,
  eventId:string
}

const SessionContent = ({currentSession, eventId}:SessionContentProps) => {
  return (
    <div className='flex flex-col gap-3' >
      <SessionContentTop currentSession={currentSession} eventId={eventId}  />
      <AttendanceTable currentSession={currentSession} />
    </div>
  )
}

export default SessionContent
