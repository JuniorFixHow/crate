'use client'
import { searchAvailableFacilities } from '@/functions/search'
import { ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { useFetchAvailableFacilities } from '@/hooks/fetch/useFacility';

export type SearchSelectFacilitiesProps = {
  isGeneric?:boolean,
  require?:boolean,
  venueId:string,
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectFacilities = ({isGeneric, venueId, require, setSelect, className, ...props}:SearchSelectFacilitiesProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {facilities} = useFetchAvailableFacilities(venueId);
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
          <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' value='' >Facilities</option>
        }
        {
            searchAvailableFacilities(search,facilities).map((facility)=>(
                <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' key={facility?._id} value={facility?._id}>{facility?.name} - {facility?.floor}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectFacilities
