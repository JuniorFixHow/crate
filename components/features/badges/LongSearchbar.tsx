import React, { ComponentProps, Dispatch, SetStateAction } from 'react';
import { IoIosSearch } from "react-icons/io";

type SearchBarProps = {
    reversed?:boolean,
    placeholder?:string,
    setSearch: Dispatch<SetStateAction<string>>
} & ComponentProps<'div'>

const LongSearchbar = ({reversed, placeholder, setSearch, className, ...props}:SearchBarProps) => {
  return (
    <div {...props}  className={`${className} px-1 items-center bg-[#d6d6d6] dark:bg-transparent border border-slate-400 rounded-full flex ${reversed ? 'flex-row-reverse':'flex-row'}`} >
        <IoIosSearch className='text-slate-500' size={20} />
        <input autoFocus  className='border-none placeholder:text-[0.8rem] grow bg-transparent outline-none px-2 py-1' type="text" placeholder={placeholder ? placeholder : 'search here...'} onChange={(e)=>setSearch(e.target.value)} />
    </div>
  )
}

export default LongSearchbar