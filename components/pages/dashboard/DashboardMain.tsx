'use client'
import Link from 'next/link'
import React, {  useState } from 'react'
import { BsCashCoin } from 'react-icons/bs'
import { CiCirclePlus } from 'react-icons/ci'
import { RiQrScan2Line } from 'react-icons/ri'
import DashboardGlobal from './DashboardGlobal'
import DashboardEvent from './DashboardEvent'
import { useFetchEverything } from '@/hooks/fetch/useEverything'
import { useAuth } from '@/hooks/useAuth'
import { checkIfAdmin } from '@/components/Dummy/contants'
import {  canPerformAction, eventOrganizerRoles, eventRegistrationRoles, isChurchAdmin, memberRoles, paymentRoles } from '@/components/auth/permission/permission'

const DashboardMain = () => {
  const [viewMode, setViewMode] = useState<string>('Global');
  const {members, registrations, events, zones, churches, loading} = useFetchEverything();
  
  const {user} = useAuth();
  const isAdmin = checkIfAdmin(user);
  const readOrganizer = canPerformAction(user!, 'reader', {eventOrganizerRoles});
  const createOrganizer = canPerformAction(user!, 'creator', {eventOrganizerRoles});
  const updateOrganizer = canPerformAction(user!, 'updater', {eventOrganizerRoles});
  const topAdmin = (isAdmin  || eventRegistrationRoles.admin(user!)  || isChurchAdmin.reader(user!))
  // console.log(user)
  // if(!user) return;

  // if(!user) return;
  return (
    <div className='page' >
        <div className="flex flex-wrap flex-row items-center justify-between">
          <span className="text-xl font-bold">Dashboard</span>
          <div className="flex flex-row items-center gap-4">
            {
              (topAdmin || readOrganizer) &&
              <select className='border outline-none bg-transparent px-3 py-1 rounded' onChange={(e)=>setViewMode(e.target.value)} name="view" defaultValue='Global' >
                <option className='dark:text-white dark:bg-black'  value="Global">Global</option>
                <option className='dark:text-white dark:bg-black'  value="Event">By Event</option>
              </select>
            }
            {
              (isAdmin || paymentRoles.creator(user!) || createOrganizer || isChurchAdmin.creator(user!)) &&
              <Link href={'/dashboard/revenue'}  className="flex bg-white dark:bg-transparent dark:border cursor-pointer text-[0.9rem] gap-2 p-1 rounded flex-row items-center">
                <BsCashCoin />
                  <span className='font-semibold' >Make Payment</span>
              </Link>
            }
            {
              (isAdmin || eventRegistrationRoles.updater(user!) || updateOrganizer || isChurchAdmin.creator(user!)) &&
            <Link href={`/dashboard/events/sessions/scan`}  className="flex bg-white dark:bg-transparent dark:border cursor-pointer text-[0.9rem] gap-2 p-1 rounded flex-row items-center">
                <RiQrScan2Line/>
                <span className='font-semibold' >Scan Badge</span>
            </Link>
            }
            {
              (isAdmin || memberRoles.creator(user!) || isChurchAdmin.creator(user!) ) &&
              <Link href='/dashboard/members/new'  className={`flex bg-[#3C60CA] dark:bg-transparent text-white dark:border cursor-pointer text-[0.9rem] gap-2 p-1 rounded flex-row items-center`}>
                  <CiCirclePlus size={20} />
                  <span className='font-semibold' >Add Member</span>
              </Link>
            }

          </div>
      </div>
        {
          // (isAdmin || churchRoles.admin(user) || memberRoles.reader(user)) &&
          <DashboardGlobal
            members={members}
            zones={zones}
            churches={churches}
            registrations={registrations}
            events={events}
            loading={loading} 
          className={`${viewMode === 'Global' ? 'flex':'hidden'}`} />
        }

        <DashboardEvent
          members={members}
          zones={zones}
          churches={churches}
          registrations={registrations}
          events={events}
          loading={loading} 
        className={`${viewMode === 'Event' ? 'flex':'hidden'}`} />
      
    </div>
  )
}

export default DashboardMain