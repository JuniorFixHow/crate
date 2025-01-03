import SearchSelectZones from "@/components/features/SearchSelectZones";
import { Dispatch, SetStateAction } from "react";
import { CiFilter } from "react-icons/ci";
import { RxReset } from "react-icons/rx";

type ChurchFilterProps = {
    setZone:Dispatch<SetStateAction<string>>
}

const ChurchFilter = ({setZone}:ChurchFilterProps) => {
  return (
    <div className='border rounded flex flex-row items-center' >
        <div className="flex flex-row gap-3 dark:bg-transparent  px-3 py-2 border-r border-r-slate-300">
           <CiFilter className="text-slate-400" size={20} /> 
           <span className="text-slate-400 text-[0.8rem]" >Filter</span>
        </div>
        <SearchSelectZones noborder isGeneric setSelect={setZone} />
        <div onClick={()=>setZone('')}   className="flex flex-row cursor-pointer gap-3 dark:bg-transparent dark:hover:border-blue-600 hover:bg-slate-200 px-3 py-1 ">
           <RxReset className="text-red-600" size={20} /> 
           <span className="text-red-600 text-[0.8rem]" >Reset</span>
        </div>
    </div>
  )
}

export default ChurchFilter