'use client'
import { Grey } from '@/components/Dummy/contants'
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image'
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa"
import { useAuth } from '@/hooks/useAuth';
import SearchResult from './SearchResult';
import Link from 'next/link';

const Header = () => {
  const {theme, toggleTheme} = useTheme();
  const {user} = useAuth();
  // alert(user?.churchId)

  const [search, setSearch] = useState<string>('');

  return (
    <header className='flex-wrap relative flex p-4 pl-8 xl:pl-4 flex-row justify-between rounded-lg border-b border-slate-200' >
      <Link href='/dashboard/profile'  className="flex flex-row items-center gap-2">
        {
          user?.photo &&
          <div className="flex relative w-12 h-12">

          <Image src={user?.photo} alt='user' fill  className='rounded-full' />
          </div>
        }
        <div className="flex flex-col">
          <span className='text-[1rem] font-bold dark:text-slate-200' >Welcome Back,</span>
          <span className={`text-[${Grey}] text-sm`}>{user?.name}</span>
        </div>
      </Link>

      <div className="flex flex-row gap-8 items-center">
        {
          theme === 'dark' ?
          <MdOutlineWbSunny onClick={toggleTheme}  className='dark:text-slate-100 cursor-pointer' />
          :
          <FaRegMoon onClick={toggleTheme}  className='dark:text-slate-100 cursor-pointer' />
        }
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center dark:border bg-white dark:bg-transparent border-slate-400 rounded px-2">
            <CiSearch className='dark:text-slate-300' />
            <input onChange={(e)=>setSearch(e.target.value)} type="text" placeholder='search here...' name="search" className='px-2 py-1 placeholder:text-slate-500 placeholder:text-[0.8rem] bg-transparent border-none outline-none dark:text-slate-300' />
          </div>
        </div>
      </div>
      {
        search.length > 0 &&
        <SearchResult search={search} setSearch={setSearch} />
      }
    </header>
  )
}

export default Header