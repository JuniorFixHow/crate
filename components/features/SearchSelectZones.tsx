'use client'

import { ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { useFetchZones } from '@/hooks/fetch/useZone';
import { SearchZone } from '../pages/zones/fxn';

export type SearchSelectZonesProps = {
  isGeneric?:boolean,
  noborder?:boolean,
  require?:boolean,
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectZones = ({isGeneric, noborder, require, setSelect, className, ...props}:SearchSelectZonesProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {zones} = useFetchZones();
  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        {
            showSearch &&
            <div className="flex flex-row justify-between items-center px-1">
                <input onChange={(e)=>setSearch(e.target.value)}  className='bg-transparent w-[85%] text-[0.9rem] placeholder:italic border-none outline-none' type="text" placeholder='text here...' />
                <IoCloseSharp onClick={()=>setShowSearch(false)} size={20} className='text-red-700 cursor-pointer' />
            </div>
        }
      <select required={require} onChange={(e)=>setSelect!(e.target.value)}  onClick={()=>setShowSearch(true)}  className={`scrollbar-custom min-w-[12rem] ${!noborder && 'rounded border'} py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent outline-none`} >
        {
          search === '' &&
          <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' value="">Zones</option>
        }
        {
            SearchZone(zones, search).map((zone)=>(
                <option   className='bg-white text-black dark:text-white dark:bg-[#0F1214]' key={zone?._id} value={zone?._id}>{zone?.name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectZones
