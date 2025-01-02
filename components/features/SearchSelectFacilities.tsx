'use client'
import { searchAvailableFacilities } from '@/functions/search'
import { ChangeEvent, ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { useFetchAvailableFacilities } from '@/hooks/fetch/useFacility';
import { IFacility } from '@/lib/database/models/facility.model';

export type SearchSelectFacilitiesProps = {
  isGeneric?:boolean,
  require?:boolean,
  venueId:string,
  setSelect?:Dispatch<SetStateAction<string>>,
  setCurrentFacility?:Dispatch<SetStateAction<IFacility|null>>,
} &ComponentProps<'div'>

const SearchSelectFacilities = ({isGeneric, venueId, require, setSelect, setCurrentFacility, className, ...props}:SearchSelectFacilitiesProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {facilities} = useFetchAvailableFacilities(venueId);

    const handleChange = (e:ChangeEvent<HTMLSelectElement>)=>{
      const selectedFacilityId = e.target.value;
      const selectedFacility = facilities.find(facility => facility._id === selectedFacilityId);
      setSelect!(selectedFacilityId); // Set the selected value
      setShowSearch(true); // Show search
      if (selectedFacility) {
        setCurrentFacility!(selectedFacility); // Set the current facility
      }
    }

  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        {
            showSearch &&
            <div className="flex flex-row justify-between items-center px-1">
                <input onChange={(e)=>setSearch(e.target.value)}  className='bg-transparent w-[85%] text-[0.9rem] placeholder:italic border-none outline-none' type="text" placeholder='text here...' />
                <IoCloseSharp onClick={()=>setShowSearch(false)} size={20} className='text-red-700 cursor-pointer' />
            </div>
        }
      <select required={require} onChange={handleChange} onClick={()=>setShowSearch(true)}  className={`scrollbar-custom border rounded py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent dark:text-white outline-none`} >
        {
          search === '' &&
          <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' value='' >Facilities</option>
        }
        {
            searchAvailableFacilities(search,facilities).map((facility)=>(
                <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' key={facility?._id} value={facility?._id}>{facility?.name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectFacilities
