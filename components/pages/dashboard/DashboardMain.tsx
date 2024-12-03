'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsCashCoin } from 'react-icons/bs'
import { CiCirclePlus } from 'react-icons/ci'
import { RiQrScan2Line } from 'react-icons/ri'
import DashboardGlobal from './DashboardGlobal'
import DashboardEvent from './DashboardEvent'
// import { useAuth } from '@/hooks/useAuth'

const DashboardMain = () => {
  const [viewMode, setViewMode] = useState<string>('Global')
  // const {user} = useAuth()
  // console.log(user)
  return (
    <div className='page' >
        <div className="flex flex-wrap flex-row items-center justify-between">
          <span className="text-xl font-bold">Dashboard</span>
          <div className="flex flex-row items-center gap-4">
            
            <select className='border outline-none bg-transparent px-3 py-1 rounded' onChange={(e)=>setViewMode(e.target.value)} name="view" defaultValue='Global' >
              <option className='dark:text-white dark:bg-black'  value="Global">Global</option>
              <option className='dark:text-white dark:bg-black'  value="Event">By Event</option>
            </select>

            <div className="flex bg-white dark:bg-transparent dark:border cursor-pointer text-[0.9rem] gap-2 p-1 rounded flex-row items-center">
              <BsCashCoin />
                <span className='font-semibold' >Make Payment</span>
            </div>
            <Link href={`/dashboard/events/sessions/scan`}  className="flex bg-white dark:bg-transparent dark:border cursor-pointer text-[0.9rem] gap-2 p-1 rounded flex-row items-center">
                <RiQrScan2Line/>
                <span className='font-semibold' >Scan Badge</span>
            </Link>

            <Link href='/dashboard/members/new'  className={`flex bg-[#3C60CA] dark:bg-transparent text-white dark:border cursor-pointer text-[0.9rem] gap-2 p-1 rounded flex-row items-center`}>
                <CiCirclePlus size={20} />
                <span className='font-semibold' >Add Member</span>
            </Link>

          </div>
      </div>

        <DashboardGlobal className={`${viewMode === 'Global' ? 'flex':'hidden'}`} />
        <DashboardEvent className={`${viewMode === 'Event' ? 'flex':'hidden'}`} />
      
    </div>
  )
}

export default DashboardMain