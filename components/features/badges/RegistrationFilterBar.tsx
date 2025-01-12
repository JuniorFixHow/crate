'use client'
import { Dispatch, SetStateAction, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaUndo } from "react-icons/fa";
import BasicDatePicker from "@/components/features/DatePicker";

export type RegistrationFilterBarProps = {
    setRoom:Dispatch<SetStateAction<string>>
    setBadge:Dispatch<SetStateAction<string>>
    setDate:Dispatch<SetStateAction<string>>,
    reset:()=>void
}
const RegistrationFilterBar = ({ setRoom, setBadge, reset,  setDate}:RegistrationFilterBarProps) => {
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
        
       
        
        <select onChange={(e)=>setBadge(e.target.value)} defaultValue='badge'   className="border border-slate-400 outline-none  bg-white dark:bg-transparent flex-row   p-[0.52rem]">
            <option className="dark:bg-black" value="">Badge</option>
            <option className="dark:bg-black" value="Yes">Printed</option>
            <option className="dark:bg-black" value="No">Pending</option>
        </select>
        <select onChange={(e)=>setRoom(e.target.value)} defaultValue='room'   className="border border-slate-400 outline-none  bg-white dark:bg-transparent flex-row   p-[0.52rem]">
            <option className="dark:bg-black" value="">Room</option>
            <option className="dark:bg-black" value="Assigned">Assigned</option>
            <option className="dark:bg-black" value="Unassigned">Pending</option>
        </select>

        <div onClick={reset}  className="border border-slate-400 gap-2 cursor-pointer hover:bg-slate-100 bg-white dark:bg-transparent flex-row flex items-center p-2">
            <FaUndo className="text-red-600 font-semibold" />
            <span className="text-red-600" >Reset Filter</span>
        </div>

       
    </div>
  )
}

export default RegistrationFilterBar