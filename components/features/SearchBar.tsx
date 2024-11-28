import  { ComponentProps, Dispatch, SetStateAction } from 'react';
import { IoIosSearch } from "react-icons/io";

type SearchBarProps = {
    reversed:boolean,
    setSearch: Dispatch<SetStateAction<string>>
} & ComponentProps<'div'>

const SearchBar = ({reversed, setSearch, className, ...props}:SearchBarProps) => {
  return (
    <div {...props}  className={`${className} px-1 items-center bg-white dark:bg-transparent border border-slate-400 rounded flex ${reversed ? 'flex-row-reverse':'flex-row'}`} >
        <IoIosSearch className='text-slate-500' size={18} />
        <input className='border-none placeholder:text-[0.8rem] grow bg-transparent outline-none px-1' type="text" placeholder='search here...' onChange={(e)=>setSearch(e.target.value)} />
    </div>
  )
}

export default SearchBar