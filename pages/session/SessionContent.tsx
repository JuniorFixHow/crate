import SessionContentTop from '@/features/sessions/SessionContentTop'
import AttendanceTable from '@/tables/AttendanceTable'
import React from 'react'

const SessionContent = () => {
  return (
    <div className='flex flex-col gap-3' >
      <SessionContentTop/>
      <AttendanceTable/>
    </div>
  )
}

export default SessionContent
