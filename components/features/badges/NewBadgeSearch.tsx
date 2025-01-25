'use client'
import { useState } from 'react'
import LongSearchbar from './LongSearchbar'
import BadgeSearchItem from './BadgeSearchItem'

import { useFetchMembers } from '@/hooks/fetch/useMember'
import {  searchMemberInversed } from '@/functions/search'
import Link from 'next/link'

type NewBadgeSearchProps = {
  isRegisterItem?:boolean;
}

const NewBadgeSearch = ({isRegisterItem}:NewBadgeSearchProps) => {
    const [search, setSearch] = useState<string>('');
    const {members} = useFetchMembers();
    const searched = searchMemberInversed(search, members);
  return (
    <div className="flex flex-col">
        <div className='p-4 shadow-xl flex bg-white dark:bg-[#0F1214] border' >
            <LongSearchbar className='w-full' setSearch={setSearch} placeholder='type here to search for a member'  />
        </div>
        {
          search !== '' && searched.length <= 0  ?
          <Link className='table-link' href='/dashboard/members/new' > Create Member </Link>
          :
          <div className='p-4 shadow-xl flex-col gap-6 flex bg-white dark:bg-[#0F1214] border border-t-0' >
            {
              searchMemberInversed(search, members).map((member)=>(
                <BadgeSearchItem 
                key={member._id}
                isRegisterItem={isRegisterItem}  
                member={member} 
                />
              ))
            }
          </div>
        }
    </div>
  )
}

export default NewBadgeSearch