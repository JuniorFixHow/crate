'use client'
import { ComponentProps, Dispatch, SetStateAction } from 'react'
import './customscroll.css';

export type SearchSelectGlobalProps = {
  isGeneric?:boolean,
  require?:boolean,
  name?:string,
  data:string[]
  setSelect?:Dispatch<SetStateAction<string>>
} &ComponentProps<'div'>

const SearchSelectGlobal = ({isGeneric, require, data, name, setSelect, className, ...props}:SearchSelectGlobalProps) => {
    
  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        
      <select required={require} onChange={(e)=>setSelect!(e.target.value)} name={name}  className={`scrollbar-custom border rounded py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent dark:text-white outline-none`} >
        <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' value='All' >All</option>
        {
            data.map((item, index)=>(
                <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' key={index} value={item}>{item}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectGlobal
