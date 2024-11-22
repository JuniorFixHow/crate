'use client'
import { ComponentProps, useState } from "react"
import { FaCaretDown } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { BooleanStateProp, EventProps,  StringStateProp } from "@/types/Types";
import { EventsData } from "@/Dummy/Data";
import './customscroll.css'
import {  searchItems } from "@/functions/search";

type SearchSelectEventProps = StringStateProp &
BooleanStateProp & ComponentProps<'div'> & {forSession?:boolean}

const SearchSelectEvent = ({text, setText, value, forSession, setValue, className, ...props}:SearchSelectEventProps) => {
  const [search, setSearch] = useState<string>('');

  const handleSelect = (item:string)=>{
    setText(item);
    setValue(false);
  }

  return (
    <div {...props}  className={`${className} z-50 flex rounded bg-white dark:bg-black border flex-col gap-4 `} >
      {
        !value &&
          <div onClick={()=>setValue(true)}  className={`flex rounded border ${forSession ? 'bg-[#3C60CA] text-white border-none':'bg-white'} dark:bg-black dark:bg-transparent flex-row items-center justify-between w-full py-1 px-2 cursor-pointer`}>
          <span className={ `${forSession ? 'text-white' : 'text-slate-500'} `} >{text? text:'Choose an event'}</span>
          <FaCaretDown className={`${forSession ? 'text-white' : 'text-slate-500'} `} />
        </div>
      }
      {
        value &&
        <div className="flex gap-2 flex-col items-start">
          <SearchBar className="w-full"  setSearch={setSearch} reversed />
          <div className={`flex flex-col ${value? 'h-[10rem]':'h-fit'} dark:bg-black dark:border px-4 py-1 rounded bg-white overflow-y-scroll scrollbar-custom`}>
          {
            searchItems(search, undefined, EventsData).map((item) => {
              if ('id' in item) { // Check if item is of type GroupProps
                const event = item as EventProps; // Type assertion
                return (
                  <span 
                    className="cursor-pointer text-slate-500 w-full hover:bg-slate-100" 
                    key={event.id} 
                    onClick={() => handleSelect(event.name)}
                  >
                    {event.name}
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

export default SearchSelectEvent