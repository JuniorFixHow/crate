import BasicDatePicker from '@/components/features/DatePicker';
import SearchBar from '@/components/features/SearchBar';
import { Dispatch, SetStateAction, useState } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

type ArrivalSearchProps = {
    setDate:Dispatch<SetStateAction<string>>;
    setSearch:Dispatch<SetStateAction<string>>;
}

const ArrivalSearch = ({setDate, setSearch}:ArrivalSearchProps) => {
    const [openDate, setOpenDate] = useState<boolean>(false);
  return (
    <div className='flex items-start gap-4' >
        <div className="flex relative flex-col">
            <div onClick={()=>setOpenDate(e=>!e)}  className="flex border border-slate-400 cursor-pointer bg-white dark:bg-transparent flex-row gap-4 items-center py-[0.15rem] px-2">
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
        <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
    </div>
  )
}

export default ArrivalSearch