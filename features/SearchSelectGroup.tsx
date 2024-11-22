'use client'
import { ComponentProps, useState } from "react"
import { FaCaretDown } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { BooleanStateProp, GroupProps, StringStateProp } from "@/types/Types";
import { Groups } from "@/Dummy/Data";
import './customscroll.css'
import {  searchItems } from "@/functions/search";

type SearchSelectGroupProps = StringStateProp &
BooleanStateProp & ComponentProps<'div'>

const SearchSelectGroup = ({text, setText, value, setValue, className, ...props}:SearchSelectGroupProps) => {
  const [search, setSearch] = useState<string>('');

  const handleSelect = (item:string)=>{
    setText(item);
    setValue(false);
  }

  return (
    <div {...props}  className={`${className} z-50 flex rounded bg-white dark:bg-black border flex-col gap-4 `} >
      {
        !value &&
        <div onClick={()=>setValue(true)}  className="flex rounded border bg-white dark:bg-black dark:bg-transparent flex-row items-center justify-between w-full py-1 px-2 cursor-pointer">
          <span className="text-slate-400" >{text}</span>
          <FaCaretDown className="text-slate-400" />
        </div>
      }
      {
        value &&
        <div className="flex gap-2 flex-col items-start">
          <SearchBar className="w-full"  setSearch={setSearch} reversed />
          <div className={`flex flex-col w-full ${value? 'h-[10rem]':'h-fit'} dark:bg-black dark:border px-4 py-1 rounded bg-white overflow-y-scroll scrollbar-custom`}>
          {
            searchItems(search, Groups).map((item) => {
              if ('id' in item) { // Check if item is of type GroupProps
                const group = item as GroupProps; // Type assertion
                return (
                  <span 
                    className="cursor-pointer text-slate-400 w-full hover:bg-slate-600" 
                    key={group.id} 
                    onClick={() => handleSelect(group.name)}
                  >
                    {group.name}
                  </span>
                );
              }
              // You can add additional checks for EventProps and MemberProps if needed
              return null; // Return null if the type does not match
            })
          }
          </div>
        </div>
      }
        {/* <input placeholder="type keyword" type="search" name="search" className="border outline-none bg-transparent rounded p-1 placeholder:text-[0.8rem] placeholder:text-slate-400" /> */}
    </div>
  )
}

export default SearchSelectGroup