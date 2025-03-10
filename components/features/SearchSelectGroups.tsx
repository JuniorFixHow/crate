'use client'
import { ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { SearchGroupWithoutEvent } from '@/components/pages/group/fxn';
// import { useFetchGroupsForEvent } from '@/hooks/fetch/useGroups';
// import { LinearProgress } from '@mui/material';
import { IGroup } from '@/lib/database/models/group.model';

export type SearchSelectGroupProps = {
  isGeneric?:boolean,
  groups:IGroup[]
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectGroups = ({isGeneric, groups, setSelect, className, ...props}:SearchSelectGroupProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    
    // console.log('groups: ', groups)
  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        {
            showSearch &&
            <div className="flex flex-row justify-between items-center px-1">
                <input onChange={(e)=>setSearch(e.target.value)}  className='bg-transparent w-[85%] text-[0.9rem] placeholder:italic border-none outline-none' type="text" placeholder='text here...' />
                <IoCloseSharp onClick={()=>setShowSearch(false)} size={20} className='text-red-700 cursor-pointer' />
            </div>
        }
        {
          // loading ?
          // <LinearProgress className='w-full' />
          // :
          <select onChange={(e)=>setSelect!(e.target.value)}  onClick={()=>setShowSearch(true)}  className={`scrollbar-custom border rounded py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent dark:text-white outline-none`} >
            <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' value='' >Groups</option>
            {
                SearchGroupWithoutEvent(groups, search).map((event)=>(
                    <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' key={event?._id} value={event?._id}>{event?.name}</option>
                ))
            }
          </select>
        }
    </div>
  )
}

export default SearchSelectGroups
