import { Dispatch, SetStateAction } from "react";
import { CiFilter } from "react-icons/ci";
import { RxReset } from "react-icons/rx";

type ChurchFilterProps = {
    setZone:Dispatch<SetStateAction<string>>
}

const ChurchFilter = ({setZone}:ChurchFilterProps) => {
  return (
    <div className='border rounded flex flex-row items-center' >
        <div className="flex flex-row gap-3 dark:bg-transparent bg-slate-200 px-3 py-1 border-r border-r-slate-300">
           <CiFilter className="text-slate-400" size={20} /> 
           <span className="text-slate-400 text-[0.8rem]" >Filter</span>
        </div>
        <select onChange={(e)=>setZone(e.target.value)} defaultValue='All Zones'  className="gap-3 h-full px-3 text-[0.8rem] outline-none border-r border-r-slate-300 dark:bg-black" name="zone">
            <option className="dark:bg-black dark:text-slate-300" value="All Zones">All Zones</option>
            <option className="dark:bg-black dark:text-slate-300" value="Zone 1">Zone 1</option>
            <option className="dark:bg-black dark:text-slate-300" value="Zone 2">Zone 2</option>
            <option className="dark:bg-black dark:text-slate-300" value="Zone 3">Zone 3</option>
        </select>
        <div onClick={()=>setZone('All Zones')}   className="flex flex-row cursor-pointer gap-3 dark:bg-transparent dark:hover:border-blue-600 hover:bg-slate-200 px-3 py-1 ">
           <RxReset className="text-red-600" size={20} /> 
           <span className="text-red-600 text-[0.8rem]" >Reset</span>
        </div>
    </div>
  )
}

export default ChurchFilter