'use client'
import { Dispatch, SetStateAction, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaUndo } from "react-icons/fa";
import BasicDatePicker from "@/components/features/DatePicker";

export type FilterBarProps = {
    setAge:Dispatch<SetStateAction<string>>
    setGender:Dispatch<SetStateAction<string>>
    setStatus:Dispatch<SetStateAction<string>>
    setDate:Dispatch<SetStateAction<string>>,
    reset:()=>void
}
const FilterBar = ({ setAge, setGender, reset, setStatus, setDate}:FilterBarProps) => {
    const [openDate, setOpenDate] = useState<boolean>(false);
    // console.log('Date: ',date)
  return (
    <div className="flex flex-col md:flex-row items-start ml-2 md:ml-0 " >
        
        <div className="flex border border-slate-400 flex-row gap-4 items-center p-2">
            <FiFilter  />
            <span className="text-gray-500" >Filter by</span>
        </div>

        <div className="flex relative flex-col">
            <div onClick={()=>setOpenDate(e=>!e)}  className="flex border border-slate-400 cursor-pointer bg-white dark:bg-transparent flex-row gap-4 items-center p-2">
                <span>Date</span>
                {
                    openDate ?
                    <IoMdArrowDropup  />
                    :
                    <IoMdArrowDropdown  />
                }
            </div>
            {
                openDate &&
                <BasicDatePicker setDate={setDate}  className=" z-20 dark:border dark:bg-slate-300 dark:text-white  " />
            }

        </div>
        
        <select onChange={(e)=>setStatus(e.target.value)} defaultValue='Status'   className="border border-slate-400 outline-none  bg-white dark:bg-transparent flex-row   p-[0.52rem]">
            <option className="dark:bg-[#0F1214]" value="">Status</option>
            <option className="dark:bg-[#0F1214]" value="Member">Member</option>
            <option className="dark:bg-[#0F1214]" value="Non-member">Non-member</option>
        </select>
        
        <select onChange={(e)=>setGender(e.target.value)} defaultValue='Gender'   className="border border-slate-400 outline-none  bg-white dark:bg-transparent flex-row   p-[0.52rem]">
            <option className="dark:bg-[#0F1214]" value="">Gender</option>
            <option className="dark:bg-[#0F1214]" value="Male">Male</option>
            <option className="dark:bg-[#0F1214]" value="Female">Female</option>
        </select>
        <select onChange={(e)=>setAge(e.target.value)} defaultValue='Age'   className="border border-slate-400 outline-none  bg-white dark:bg-transparent flex-row   p-[0.52rem]">
            <option className="dark:bg-[#0F1214]" value="">Age</option>
            <option className='dark:bg-black' value="0-5">0-5</option>
            <option className='dark:bg-black' value="6-10">6-10</option>
            <option className='dark:bg-black' value="11-20">11-20</option>
            <option className='dark:bg-black' value="21-30">21-30</option>
            <option className='dark:bg-black' value="31-40">31-40</option>
            <option className='dark:bg-black' value="41-50">41-50</option>
            <option className='dark:bg-black' value="51-60">51-60</option>
            <option className='dark:bg-black' value="61+">61+</option>
        </select>

        <div onClick={reset}  className="border border-slate-400 gap-2 cursor-pointer hover:bg-slate-100 bg-white dark:bg-transparent flex-row flex items-center p-2">
            <FaUndo className="text-red-600 font-semibold" />
            <span className="text-red-600" >Reset Filter</span>
        </div>

       
    </div>
  )
}

export default FilterBar