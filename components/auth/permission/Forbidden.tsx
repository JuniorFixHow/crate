'use client'

import Title from "@/components/features/Title";
import { useSearchParams } from "next/navigation"
import { IoIosArrowForward } from "react-icons/io";

// type ForbiddenProps = {
//     text?:string
// }

const Forbidden = () => {
    const searchParams = useSearchParams();
    const message = searchParams.get('p');
  return (
    <div className="page" >
        <div className="flex flex-row items-baseline gap-2">
            <Title clickable link='/dashboard' text='Home' />
            <IoIosArrowForward/>
            <Title text='Forbidden' />
        </div>

        <div className="table-main2 h-[50vh]">
            <div className="size-full flex-center gap-5 flex-col">
                <span className="text-3xl text-red-600 font-bold" >Access Denied!</span>
                <span className="font-semibold" >You do not have access to view the page</span>
                {
                    message &&
                    <div className="flex gap-3 font-semibold">
                        <span className="text-[0.9rem]" >Minimum permission:</span>
                        <span className="text-[0.9rem] text-red-600" >{message}</span>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default Forbidden