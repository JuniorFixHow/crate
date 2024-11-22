'use client'
import { members } from "@/Dummy/Data"
import AddButton from "@/features/AddButton"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import MRegisteration from "./MRegisteration"

export type MDetailsProps = {
  id:string
}
const MDetails = ({id}:MDetailsProps) => {
  const [hasOpen, setHasOpen] = useState<boolean>(false)
  const member = members.filter((member)=>member.id === id)[0]

  return (
    <>
    {
      hasOpen ? 
      <MRegisteration setHasOpen={setHasOpen} currentMemeber={member} />
      :
      <div className="px-8 py-4 flex-col dark:bg-black dark:border dark:border-t-0 flex md:flex-row gap-6 items-start bg-white" >
        <div className="flex items-center bg-[#f1f1f1] p-3 justify-center rounded-full">
          <Image height={100} width={100} src={member?.photo} className="object-contain rounded-full" alt="member photo" />
        </div>
        
        <div className="flex flex-col gap-3 items-start">
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Name:</span>
              <span className="text-[0.8rem] text-slate-400" >{member?.name}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Email:</span>
              <span className="text-[0.8rem] text-slate-400" >{member?.email}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Number:</span>
              <span className="text-[0.8rem] text-slate-400" >+233 637 723 743</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Gender:</span>
              <span className="text-[0.8rem] text-slate-400" >{member?.gender}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Age Group:</span>
              <span className="text-[0.8rem] text-slate-400" >{member?.ageRange}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Status:</span>
              <span className="text-[0.8rem] text-slate-400" >{member?.status}</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Group/Family:</span>
              <span className="text-[0.8rem] text-slate-400" >Yes <Link className="text-blue-800 hover:underline font-bold" href={`/dashboard/group/${member?.groupId}`} >({member?.groupId})</Link></span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Voice:</span>
              <span className="text-[0.8rem] text-slate-400" >Bass</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Marital status:</span>
              <span className="text-[0.8rem] text-slate-400" >Married</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Dietary restrictions:</span>
              <span className="text-[0.8rem] text-slate-400" >Yes (Doesn&apos;t take milk)</span>
            </div>
            <div className="flex flex-row items-start gap-4">
              <span className="text-[0.8rem] font-semibold" >Registration note:</span>
              <span className="text-[0.8rem] md:w-[30rem] text-slate-400" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque expedita quisquam est at repudiandae nesciunt mollitia consequatur magnam assumenda molestiae.</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Registered By:</span>
              <span className="text-[0.8rem] text-slate-400" >Bruce Lee</span>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="text-[0.8rem] font-semibold" >Registered On:</span>
              <span className="text-[0.8rem] text-slate-400" >{member?.dateOfReg}</span>
            </div>

            <div className="flex flex-row items-center gap-8 mt-4">
              <AddButton onClick={()=>setHasOpen(true)} noIcon className="rounded" smallText text="Edit" />
              <AddButton isDanger noIcon className="rounded" smallText text="Delete" />
            </div>
          </div>
      </div>
    }
    </>
  )
}

export default MDetails