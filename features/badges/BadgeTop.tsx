'use client'
import { IoCheckmarkCircleOutline, IoCloseSharp  } from "react-icons/io5";
import { ComponentProps, useState } from "react";
import SearchSelectEvents from "../SearchSelectEvents";

const BadgeTop = ({className, ...props}:ComponentProps<'div'>) => {
    // const [value, setValue] = useState<boolean>(false);
    // const [selected, setSelected] = useState<string>('');
  return (
    <div {...props}  className={`flex flex-row items-start gap-8 ${className}`}>
        <div className="flex flex-row relative">
            <SearchSelectEvents isGeneric />
            {/* {
                value &&
                <IoCloseSharp className="text-red-700 cursor-pointer absolute -top-4 right-0 z-50" onClick={()=>setValue(false)} />
            } */}
        </div>
        <div className="flex flex-row items-center gap-4 px-4 py-1 bg-white dark:bg-black border w-fit">
            <IoCheckmarkCircleOutline className='text-blue-700' />
            <div className="flex flex-row">
            <span className='text-red-700 font-medium' >36</span>
            <span className='font-medium' >/40</span>
            </div>
        </div>
        {/* <div className="flex flex-row gap-6">
        </div> */}
    </div>
  )
}

export default BadgeTop