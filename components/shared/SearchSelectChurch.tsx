'use client'
import { ChurchData } from '@/pages/churches/ChurchData'
import { SearchChurchWithoutZone } from '@/pages/vendor/fxn'
import { ComponentProps, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'


const SearchSelectChurch = ({isGeneric, className, ...props}:{isGeneric?:boolean}&ComponentProps<'div'>) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        {
            showSearch &&
            <div className="flex flex-row justify-between items-center px-1">
                <input onChange={(e)=>setSearch(e.target.value)}  className='bg-transparent w-[85%] text-[0.9rem] placeholder:italic border-none outline-none' type="text" placeholder='text here...' />
                <IoCloseSharp onClick={()=>setShowSearch(false)} size={20} className='text-red-700 cursor-pointer' />
            </div>
        }
      <select defaultValue={ChurchData[0]?.id} onClick={()=>setShowSearch(true)}  className={`border rounded py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent outline-none`} >
        {
            SearchChurchWithoutZone(ChurchData, search).map((event)=>(
                <option className='bg-white text-black dark:text-white dark:bg-black' key={event?.id} value={event?.id}>{event?.name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectChurch
