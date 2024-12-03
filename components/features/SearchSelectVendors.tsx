'use client'
import {  searchVednor } from '@/functions/search'
import { ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { useFetchVendors } from '@/hooks/fetch/useVendor';
import { useAuth } from '@/hooks/useAuth';

export type SearchSelectVendorsProps = {
  isGeneric?:boolean,
  require?:boolean,
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectVendors = ({isGeneric, require, setSelect, className, ...props}:SearchSelectVendorsProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {user} = useAuth()
    const {vendors} = useFetchVendors();
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
          <option className='bg-white text-black dark:text-white dark:bg-black' value={user?.userId} >{user?.name}</option>
        }
        {
            searchVednor(search,vendors).map((vednor)=>(
                <option className='bg-white text-black dark:text-white dark:bg-black' key={vednor?._id} value={vednor?._id}>{vednor?.name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectVendors
