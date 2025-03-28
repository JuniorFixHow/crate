import SessionContentTop from '@/components/features/sessions/SessionContentTop'
import AttendanceTable from '@/components/tables/AttendanceTable'
import { ISession } from '@/lib/database/models/session.model'
import React from 'react'
import NoSessions from '../activity/session/NoSessions'
import { IEvent } from '@/lib/database/models/event.model'

type SessionContentProps = {
  currentSession:ISession,
  eventId:string,
  loading:boolean,
  currentEvent:IEvent|null
}

const SessionContent = ({currentSession, currentEvent, loading, eventId}:SessionContentProps) => {
  return (
    <div className='flex flex-col gap-3' >
      <SessionContentTop currentSession={currentSession} eventId={eventId}  />
      {
        currentSession ?
        <AttendanceTable currentEvent={currentEvent} currentSession={currentSession} />
        :
        <NoSessions loading={loading} />
      }
    </div>
  )
}

export default SessionContent
