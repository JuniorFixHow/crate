'use client'

import { IHubclass } from "@/lib/database/models/hubclass.model"
import { useState } from "react"

type ClassContentProps = {
    currentClass:IHubclass
}

const ClassContent = ({}:ClassContentProps) => {
    const [title, setTitle] = useState<string>('Members');

    const titles = ['Members', 'Leaders', 'Teachers'];

  return (
    <div className="shadow-md bg-white dark:border rounded-md px-8 py-4" >
        <div className="flex gap-3">
            {
                titles.map((item)=>{
                    const selected = item === title;
                    return(
                        <div className={`flex items-end cursor-pointer ${selected && 'border-b-2 border-blue-600'} px-2`} key={item} onClick={()=>setTitle(item)} >
                            <span className={`${selected ? 'text-black dark:text-white':'text-slate-500'} font-semibold`} >{item}</span>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default ClassContent