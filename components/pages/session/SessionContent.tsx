import SessionContentTop from '@/components/features/sessions/SessionContentTop'
import AttendanceTable from '@/components/tables/AttendanceTable'
import { ISession } from '@/lib/database/models/session.model'
import React from 'react'
import NoSessions from '../activity/session/NoSessions'

type SessionContentProps = {
  currentSession:ISession,
  eventId:string,
  loading:boolean
}

const SessionContent = ({currentSession, loading, eventId}:SessionContentProps) => {
  return (
    <div className='flex flex-col gap-3' >
      <SessionContentTop currentSession={currentSession} eventId={eventId}  />
      {
        currentSession ?
        <AttendanceTable currentSession={currentSession} />
        :
        <NoSessions loading={loading} />
      }
    </div>
  )
}

export default SessionContent
