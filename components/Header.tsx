'use client'
import { Grey } from '@/components/Dummy/contants'
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image'
import React from 'react'
import { CiSearch } from "react-icons/ci";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa"

const Header = () => {
  const {theme, toggleTheme} = useTheme();
  return (
    <header className='flex-wrap flex p-4 pl-8 xl:pl-4 flex-row justify-between rounded-lg border-b border-slate-200' >
      <div className="flex flex-row items-center gap-2">
        <Image src='/9187604.png' alt='user' height={30} width={30} className='rounded-full' />
        <div className="flex flex-col">
          <span className='text-[1rem] font-bold dark:text-slate-200' >Welcome Back,</span>
          <span className={`text-[${Grey}] text-sm`}>Johson Smith</span>
        </div>
      </div>

      <div className="flex flex-row gap-8 items-center">
        {
          theme === 'dark' ?
          <MdOutlineWbSunny onClick={toggleTheme}  className='dark:text-slate-100 cursor-pointer' />
          :
          <FaRegMoon onClick={toggleTheme}  className='dark:text-slate-100 cursor-pointer' />
        }
        <div className="flex flex-row items-center dark:border bg-white dark:bg-transparent border-slate-400 rounded px-2">
          <CiSearch className='dark:text-slate-300' />
          <input type="text" placeholder='search here...' name="search" className='px-2 py-1 placeholder:text-slate-500 placeholder:text-[0.8rem] bg-transparent border-none outline-none dark:text-slate-300' />
        </div>
      </div>
    </header>
  )
}

export default Header