'use client'
import { useState } from 'react'
import LongSearchbar from './LongSearchbar'
import BadgeSearchItem from './BadgeSearchItem'
import { searchItems } from '@/functions/search'
import { members } from '@/Dummy/Data'
import { MemberProps } from '@/types/Types'

const NewBadgeSearch = () => {
    const [search, setSearch] = useState<string>('')
  return (
    <div className="flex flex-col">
        <div className='p-4 shadow-xl flex bg-white dark:bg-black border' >
            <LongSearchbar className='w-full' setSearch={setSearch} placeholder='type here to search for a member'  />
        </div>
        <div className='p-4 shadow-xl flex-col gap-6 flex bg-white dark:bg-black border border-t-0' >
          {
            searchItems(search, undefined, undefined, members).map((item)=>{
              if('id' in item){
                const member = item as MemberProps
                return(
                  <BadgeSearchItem key={member.id}    member={member} />
                )
              }
              return null
            })
          }
        </div>
    </div>
  )
}

export default NewBadgeSearch