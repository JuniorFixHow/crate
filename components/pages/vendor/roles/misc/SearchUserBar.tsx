'use client'
import { Dispatch, SetStateAction } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

type SearchUserBarProps ={
    setSearch:Dispatch<SetStateAction<string>>
}
const SearchUserBar = ({setSearch}:SearchUserBarProps) => {
  return (
    <div className="flex bg-[#D6D6D6] dark:bg-transparent border border-slate-400 w-full items-center gap-2 rounded-full px-2 py-1">
        <IoSearchOutline className='text-slate-500' size={20} />
        <input onChange={(e)=>setSearch(e.target.value)} placeholder='search user...' type="text" className='placeholder:italic placeholder:text-[1rem] bg-transparent w-full outline-none' />
    </div>
  )
}

export default SearchUserBar