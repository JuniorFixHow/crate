'use client'
import { searchClass } from '@/functions/search'
import { ComponentProps, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { useFetchMinistries } from '@/hooks/fetch/useMinistry';
import { IMinistry } from '@/lib/database/models/ministry.model';

export type SearchSelectClassProps = {
  isGeneric?:boolean,
  require?:boolean,
  activityId:string,
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectClass = ({isGeneric, activityId, require, setSelect, className, ...props}:SearchSelectClassProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {data} = useFetchMinistries(activityId);
    useEffect(()=>{
      if(data?.length){
        setSelect!(data[0]?._id);
      }
    },[data, setSelect])

    if(data?.length === 0) return null;
  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        {
            showSearch &&
            <div className="flex flex-row justify-between items-center px-1">
                <input onChange={(e)=>setSearch(e.target.value)}  className='bg-transparent w-[85%] text-[0.9rem] placeholder:italic border-none outline-none' type="text" placeholder='text here...' />
                <IoCloseSharp onClick={()=>setShowSearch(false)} size={20} className='text-red-700 cursor-pointer' />
            </div>
        }
      <select required={require}  onChange={(e)=>setSelect!(e.target.value)} onClick={()=>setShowSearch(true)}  className={`scrollbar-custom border rounded py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent dark:text-white outline-none`} >
       
        {
            searchClass(search, data as IMinistry[]).map((event)=>(
                <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' key={event?._id} value={event?._id}>{event?.name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectClass
