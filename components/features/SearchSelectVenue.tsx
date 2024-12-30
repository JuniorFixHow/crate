'use client'
import {  searchVenues } from '@/functions/search'
import { ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { useFetchVenues } from '@/hooks/fetch/useVenue';

export type SearchSelectVenuesProps = {
  isGeneric?:boolean,
  require?:boolean,
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectVenues = ({isGeneric, require, setSelect, className, ...props}:SearchSelectVenuesProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {venues} = useFetchVenues();
  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        {
            showSearch &&
            <div className="flex flex-row justify-between items-center px-1">
                <input onChange={(e)=>setSearch(e.target.value)}  className='bg-transparent w-[85%] text-[0.9rem] placeholder:italic border-none outline-none' type="text" placeholder='text here...' />
                <IoCloseSharp onClick={()=>setShowSearch(false)} size={20} className='text-red-700 cursor-pointer' />
            </div>
        }
      <select required={require} onChange={(e)=>setSelect!(e.target.value)} onClick={()=>setShowSearch(true)}  className={`scrollbar-custom border rounded py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent dark:text-white outline-none`} >
        {
          search === '' &&
          <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' value='' >Venues</option>
        }
        {
            searchVenues(search,venues).map((venue)=>(
                <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' key={venue?._id} value={venue?._id}>{venue?.name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectVenues
