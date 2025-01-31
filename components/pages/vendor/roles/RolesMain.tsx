'use client'
import Title from '@/components/features/Title'
import React, { useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import SearchUser from './SearchUser'
import { IVendor } from '@/lib/database/models/vendor.model'
import Roles from './Roles'

const RolesMain = () => {
    const [selection, setSelection] = useState<IVendor[]>([]);
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
            <Title className="hidden md:block" clickable link="/dashboard/users" text="Users" />
            <IoIosArrowForward className="hidden md:block" />
            <Title text='Roles' />
        </div>

        <div className="flex flex-col gap-6">
            <SearchUser selection={selection} setSelection={setSelection} />
            <Roles selection={selection} />
        </div>
    </div>
  )
}

export default RolesMain