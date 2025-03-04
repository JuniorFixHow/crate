'use client'
import AddButton from "@/components/features/AddButton";
import Link from "next/link";
import { LuScanLine } from "react-icons/lu";
import SessionSideV2 from "./SessionSideV2";
import { useEffect, useState } from "react";
import { useFetchClassSession } from "@/hooks/fetch/useClasssession";
import { IClasssession } from "@/lib/database/models/classsession.model";
import SessionContentV2 from "./SessionContentV2";

const Sessions = ()=>{
   const [selectedTime, setSelectedTime] = useState<string>('All');
    const [ministryId, setMinistryId] = useState<string>('');
    // const [hasClickedEllipses, setHasClickedEllipses] = useState<boolean>(false);
    const [currentSession, setCurrentSession] = useState<IClasssession|null>(null);

    const {sessions, isPending, refetch} = useFetchClassSession(ministryId);

    useEffect(()=>{
      if(sessions?.length){
        const sess = sessions[0];
        setCurrentSession(sess);
      }
    },[sessions])

    // console.log(object)

    return (
      <div className=' flex flex-col gap-5' >
          <div className="flex flex-row items-center gap-4 justify-end">
            <Link href={'/dashboard/ministries/sessions/scan'}  className="flex flex-row gap-3 bg-white items-center px-8 py-[0.2rem] hover:bg-slate-100 cursor-pointer rounded border dark:bg-[#0F1214] dark:hover:border-blue-700">
                <LuScanLine/>
                <span className='text-[0.9rem] font-semibold' >Scan</span>
            </Link>
            <Link href={`/dashboard/ministries/sessions/new`} >
              <AddButton text='Create Session' noIcon smallText className='rounded' />
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 ">
            <SessionSideV2 refetch={refetch} minstryId={ministryId} setMinistryId={setMinistryId} sessions={sessions  as IClasssession[]} selectedTime={selectedTime} setSelectedTime={setSelectedTime} setCurrentSession={setCurrentSession} currentSession={currentSession!} />
            <div className="flex flex-col gap-2 grow">
              <SessionContentV2 isLoading={!!ministryId && isPending} classId={ministryId} currentSession={currentSession!} />
            </div>
          </div>
    </div>
    )
  
}

export default Sessions