
import CBar from '@/components/misc/CBar'
import CPie from '@/components/misc/CPie'
import RegistrationTable from '@/components/tables/RegistrationTable'
import React, { ComponentProps, useEffect, useState } from 'react'

import {ActivityTile} from '@/components/features/ActivityTile'
import { useAuth } from '@/hooks/useAuth'
import SearchSelectVendors from '@/components/features/SearchSelectVendors'
import { useFetchVendorStats } from '@/hooks/fetch/useVendor'
import { CircularProgress } from '@mui/material'
import { IEvent } from '@/lib/database/models/event.model'
import { IMember } from '@/lib/database/models/member.model'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IChurch } from '@/lib/database/models/church.model'
import { IZone } from '@/lib/database/models/zone.model'

type DashboardGlobalProps = {
  events:IEvent[],
  members:IMember[],
  registrations:IRegistration[]
  loading:boolean,
  churches:IChurch[],
  zones:IZone[],

} & ComponentProps<'div'>

const DashboardGlobal = ({events, zones, churches, registrations, members, loading, className, ...props}:DashboardGlobalProps) => {
  const {user} = useAuth()
  const [vendorId, setVendorId] = useState<string>('');
  const {stats, statsLoading} = useFetchVendorStats(vendorId);
  useEffect(()=>{
    if(user){
      setVendorId(user.userId);
    }
  },[user])
  return (
    <div {...props}  className={`${className} flex-col gap-8`} >
      <div className='flex flow-row w-full items-start gap-4'>
        <CBar 
          loading={loading} 
          events={events}
          members={members}
          registrations={registrations}
          zones={zones}
          churches={churches}
          className='grow'
        />

        <div className="flex flex-row  gap-4 items-start">
          <CPie members={members} registrations={registrations} loading={loading} />

          <div className="hidden lg:flex flex-col gap-[0.5rem]">
          <span className='text-[#3C60CA] font-bold text-[0.9rem] text-center' >Activities in the last 7 days</span>
          <SearchSelectVendors setSelect={setVendorId} />
          {
            statsLoading ?
            <div className="flex-center">
              <CircularProgress size='2rem' />
            </div>
            :
            <div className="flex flex-col gap-[0.5rem]">
              <ActivityTile  title='Members Registered' data={stats.members.toString()} link='/dashboard/members' query={{registeredBy:vendorId}} />
              <ActivityTile title='Events Created' data={stats.events.toString()} link='/dashboard/events' query={{id:vendorId}} />
              <ActivityTile title='Sessions Created' data={stats.sessions.toString()} link='/dashboard/events/sessions' query={{id:vendorId}} />
              <ActivityTile link='/dashboard/revenue' query={{userId:vendorId}} title='Payment Made'  data={`$${stats?.revenue?.toString()}`} />
            </div>
          }
          </div>
        </div>
      </div>

      <RegistrationTable />
    </div>
  )
}

export default DashboardGlobal