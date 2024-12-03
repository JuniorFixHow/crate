
import CBar from '@/components/misc/CBar'
import CPie from '@/components/misc/CPie'
import RegistrationTable from '@/components/tables/RegistrationTable'
import React, { ComponentProps, useEffect, useState } from 'react'

import {ActivityTile} from '@/components/features/ActivityTile'
import { useAuth } from '@/hooks/useAuth'
import SearchSelectVendors from '@/components/features/SearchSelectVendors'
import { useFetchVendorStats } from '@/hooks/fetch/useVendor'
import { CircularProgress } from '@mui/material'

const DashboardGlobal = ({className, ...props}:ComponentProps<'div'>) => {
  const {user} = useAuth()
  const [vendorId, setVendorId] = useState<string>('');
  const {stats, loading} = useFetchVendorStats(vendorId);
  useEffect(()=>{
    if(user){
      setVendorId(user.userId);
    }
  },[user])
  return (
    <div {...props}  className={`${className} flex-col gap-8`} >
      <div className='flex flow-row w-full items-start gap-4'>
        <CBar className="" />

        <div className="flex flex-row  gap-4 items-start">
          <CPie />

          <div className="hidden lg:flex flex-col gap-[0.5rem]">
          <span className='text-[#3C60CA] font-bold text-[0.9rem] text-center' >Activities in the last 7 days</span>
          <SearchSelectVendors setSelect={setVendorId} />
          {
            loading ?
            <div className="flex-center">
              <CircularProgress size='2rem' />
            </div>
            :
            <div className="flex flex-col gap-[0.5rem]">
              <ActivityTile  title='Members Registered' data={stats.members.toString()} link='/dashboard/members' query={{registeredBy:vendorId}} />
              <ActivityTile title='Events Created' data={stats.events.toString()} link='/dashboard/events' query={{id:vendorId}} />
              <ActivityTile title='Sessions Created' data={stats.sessions.toString()} link='/dashboard/events/sessions' query={{id:vendorId}} />
              <ActivityTile title='Payment Made'  data='$500.00' />
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