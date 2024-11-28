'use client'
import { useState } from 'react'
import LongSearchbar from './LongSearchbar'
import BadgeSearchItem from './BadgeSearchItem'

import { useFetchMembers } from '@/hooks/fetch/useMember'
import {  searchMemberInversed } from '@/functions/search'

const NewBadgeSearch = () => {
    const [search, setSearch] = useState<string>('');
    const {members} = useFetchMembers();
  return (
    <div className="flex flex-col">
        <div className='p-4 shadow-xl flex bg-white dark:bg-black border' >
            <LongSearchbar className='w-full' setSearch={setSearch} placeholder='type here to search for a member'  />
        </div>
        <div className='p-4 shadow-xl flex-col gap-6 flex bg-white dark:bg-black border border-t-0' >
          {
            searchMemberInversed(search, members).map((member)=>(
              <BadgeSearchItem key={member._id}    member={member} />
            ))
          }
        </div>
    </div>
  )
}

export default NewBadgeSearch