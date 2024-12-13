'use client'
import { ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import './customscroll.css';
import { useFetchCYPSet } from '@/hooks/fetch/useCYPSet';
import { SearchSet } from '../pages/public/section/fxn';

export type SearchSelectSetProps = {
  isGeneric?:boolean,
  require?:boolean,
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectSet = ({isGeneric, require, setSelect, className, ...props}:SearchSelectSetProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {cypsets} = useFetchCYPSet();
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
          <option className='bg-white text-black dark:text-white dark:bg-black' value='' >Sets</option>
        }
        {
            SearchSet(cypsets, search).map((event)=>(
                <option className='bg-white text-black dark:text-white dark:bg-black' key={event?._id} value={event?._id}>{event?.title}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectSet
