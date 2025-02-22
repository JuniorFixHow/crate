import EditSessionsMain from '@/components/pages/activity/session/EditSessionsMain';
import { getCSession } from '@/lib/actions/classsession.action';
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const currentSession = await getCSession(id);
  return (
    <div className='main-c' >
        <EditSessionsMain currentSession={currentSession} />
    </div>
  )
}

export default page