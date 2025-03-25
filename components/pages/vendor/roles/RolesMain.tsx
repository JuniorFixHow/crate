'use client'
import Title from '@/components/features/Title'
import React, { useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import SearchUser from './SearchUser'
import { IVendor } from '@/lib/database/models/vendor.model'
import Roles from './Roles'
import { canPerformAction, userRoles } from '@/components/auth/permission/permission'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const RolesMain = () => {
    const {user} = useAuth();
    const router = useRouter();
    const [selection, setSelection] = useState<IVendor[]>([]);
    const controller = canPerformAction(user!, 'controller', {userRoles});
    useEffect(()=>{
      if(user && !controller){
        router.replace('/dashboard/forbidden?p=User Admin (Full Control)');
      }
    },[user, controller, router])

    if(!controller) return;
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
            <Title className="hidden md:block" clickable link="/dashboard/users" text="Users" />
            <IoIosArrowForward className="hidden md:block" />
            <Title text='Roles' />
        </div>

        <div className="flex flex-col gap-6">
            <SearchUser selection={selection} setSelection={setSelection} />
            <Roles user={user!} selection={selection} />
        </div>
    </div>
  )
}

export default RolesMain