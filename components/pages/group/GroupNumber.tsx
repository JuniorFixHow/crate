import React from 'react'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { GroupData } from './GroupData'

const GroupNumber = () => {
  return (
    <div className='flex gap-2 cursor-default items-center bg-white border dark:bg-black rounded py-1 px-4 w-fit shadow' >
        <HiOutlineUserGroup className='text-blue-600' />
        <div className="flex flex-col">
            <span className='text-blue-600 text-[0.8rem]' >Groups/Family</span>
            <span className='dark:text-white text-[0.8rem] font-semibold' >{GroupData.length}</span>
        </div>
    </div>
  )
}

export default GroupNumber