'use client'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { getGroupLenght } from '@/lib/actions/misc'

type GroupNumberProps = {
  eventId:string
}

const GroupNumber = ({eventId}:GroupNumberProps) => {
  const [length, setLength] = useState<number>(0);
  useEffect(()=>{
    const fetchGroupLength = async()=>{
      try {
        const {length} = await getGroupLenght(eventId);
        setLength(length)
      } catch (error) {
        console.log(error)
      }
    }
    fetchGroupLength()
  },[eventId])
  return (
    <div className='flex gap-2 cursor-default items-center bg-white border dark:bg-[#0F1214] rounded py-1 px-4 w-fit shadow' >
        <HiOutlineUserGroup className='text-blue-600' />
        <div className="flex flex-col">
            <span className='text-blue-600 text-[0.8rem]' >Groups/Family</span>
            <span className='dark:text-white text-[0.8rem] font-semibold' >{length}</span>
        </div>
    </div>
  )
}

export default GroupNumber