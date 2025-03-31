'use client'
import { isSuperUser } from "@/components/auth/permission/permission";
import SearchSelectEventsV4 from "@/components/features/SearchSelectEventsV4"
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

const ChildrenContent = () => {
    const {user} = useAuth();
    const [eventId, setEventId] = useState<string>('');
    const [title, setTitle] = useState<string>('Members');
    const router = useRouter();
    const titles = ['Members', 'Attendance'];

    const su = isSuperUser(user!)

    useEffect(()=>{
        if(user && !su){
            router.replace('dashboard/forbidden')
        }
    },[router, su, user])

    console.log(eventId)
  return (
    <div className="table-main2" >
        <div className="flex flex-col gap-4 md:flex-row md:gap-10">
            <SearchSelectEventsV4 setSelect={setEventId} />
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
    </div>
  )
}

export default ChildrenContent