'use client'
import { ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { GroupData } from '@/components/pages/group/GroupData';
import { SearchGroup } from '@/components/pages/group/fxn';
import { useFetchGroups } from '@/hooks/fetch/useGroups';

export type SearchSelectGroupProps = {
  isGeneric?:boolean,
  eventId:string,
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectGroups = ({isGeneric, eventId, setSelect, className, ...props}:SearchSelectGroupProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {groups} = useFetchGroups()
  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        {
            showSearch &&
            <div className="flex flex-row justify-between items-center px-1">
                <input onChange={(e)=>setSearch(e.target.value)}  className='bg-transparent w-[85%] text-[0.9rem] placeholder:italic border-none outline-none' type="text" placeholder='text here...' />
                <IoCloseSharp onClick={()=>setShowSearch(false)} size={20} className='text-red-700 cursor-pointer' />
            </div>
        }
      <select onChange={(e)=>setSelect!(e.target.value)} defaultValue={GroupData[0]?.id} onClick={()=>setShowSearch(true)}  className={`scrollbar-custom border rounded py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent outline-none`} >
        <option className='bg-white text-black dark:text-white dark:bg-black' value='' >Groups</option>
        {
            SearchGroup(groups, search, eventId).map((event)=>(
                <option className='bg-white text-black dark:text-white dark:bg-black' key={event?._id} value={event?._id}>{event?.name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectGroups
