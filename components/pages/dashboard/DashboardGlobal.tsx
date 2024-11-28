
import CBar from '@/components/misc/CBar'
import CPie from '@/components/misc/CPie'
import RegistrationTable from '@/components/tables/RegistrationTable'
import React, { ComponentProps } from 'react'

import {ActivityTile} from '@/components/features/ActivityTile'

const DashboardGlobal = ({className, ...props}:ComponentProps<'div'>) => {
  return (
    <div {...props}  className={`${className} flex-col gap-8`} >
      <div className='flex flow-row w-full items-start gap-4'>
        <CBar className="" />

        <div className="flex flex-row  gap-4 items-start">
          <CPie />

          <div className="hidden lg:flex flex-col gap-[1.2rem] dark:gap-[1.1rem]">
          <span className='text-[#3C60CA] font-bold text-[1rem] text-center' >Activities in the last 7 days</span>
          <div className="flex flex-col gap-[0.4rem]">
            <ActivityTile title='Members Registered' link='/dashboard/members' query={{registeredBy:'3'}} />
            <ActivityTile title='Events Created' link='/dashboard/events' query={{registeredBy:'3'}} />
            <ActivityTile title='Sessions Created' data='5' link='/dashboard/events/sessions' query={{registeredBy:'3'}} />
            <ActivityTile title='Payment Made'  data='$500.00' />
          </div>
          </div>
        </div>
      </div>

      <RegistrationTable />
    </div>
  )
}

export default DashboardGlobal