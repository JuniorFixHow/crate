'use client'
import DeleteDialog from "@/components/DeleteDialog"
import { SessionsData } from "@/Dummy/Data"
import SearchSelectEvents from "@/features/SearchSelectEvents"
import Subtitle from "@/features/Subtitle"
import { searchSession } from "@/functions/search"
import { BooleanStateProp, SessionProps } from "@/types/Types"
import Link from "next/link"
import { ComponentProps, Dispatch, MouseEvent, SetStateAction, useState } from "react"
import { FaEllipsisV } from "react-icons/fa"


export type SessionSideProps = BooleanStateProp & ComponentProps<'div'> & {
    setCurrentSession:Dispatch<SetStateAction<SessionProps>>,
    currentSession:SessionProps,
    selectedTime:string,
    setSelectedTime:Dispatch<SetStateAction<string>>,
}
const SessionSide = ({currentSession, selectedTime, setSelectedTime, value, setValue, setCurrentSession,className}:SessionSideProps) => {
     const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const message = 'Deleting a session will delete its subsequent attendance. Continue?'
    const tapEllipse = (event:MouseEvent<SVGElement>, item:SessionProps)=>{
        event.stopPropagation();
        setCurrentSession(item);
        setValue(prevValue => !prevValue);
    }
    const handleClickSession = (session:SessionProps)=>{
        setCurrentSession(session);
        setValue(false);
    }
    console.log('deletemode: ', deleteMode)
  return (
    <div className='flex  flex-col w-52 rounded gap-5 py-4 px-2 bg-white border dark:bg-black' >
      <Subtitle text="Sessions" />
      <div className="flex flex-col gap-3">
        <SearchSelectEvents/>
        <select onChange={(e)=>setSelectedTime(e.target.value)}  className="bg-transparent py-1 border rounded outline-none" defaultValue='All' >
            <option className="dark:bg-black" value="All">All</option>
            <option className="dark:bg-black" value="Morning">Morning</option>
            <option className="dark:bg-black" value="Afternoon">Afternoon</option>
            <option className="dark:bg-black" value="Evening">Evening</option>
            <option className="dark:bg-black" value="Dawn">Dawn</option>
        </select>
      </div>
      {
        searchSession(selectedTime,SessionsData).map((session)=>(
        <div onClick={()=>handleClickSession(session)} key={session.id}    className="flex flex-row items-center relative">
            <div className={`absolute ${currentSession.id === session.id ? 'block':'hidden'} h-full z-10 left-[-0.4rem] px-[1px] bg-red-700 dark:bg-blue-700`}/>
            <div   className={`flex relative w-full bg-[#F4F4F4] ${currentSession.id === session.id && 'border-red-700 dark:border-blue-700'} dark:bg-black p-1 border cursor-pointer  rounded flex-row justify-between items-center ${className}`} >
                <div className="flex flex-col w-[90%]">
                    <span className="font-semibold text-ellipsis w-full overflow-hidden whitespace-nowrap" >{session?.name}</span>
                    <div className="flex flex-row gap-2 items-center">
                        <small className="font-medium" >Status:</small>
                        <small>{session?.status}</small>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <small className="font-medium" >Duration</small>
                        <small> {session?.startTime} - {session?.endTime}</small>
                    </div>
                </div>
                <FaEllipsisV className="z-50" onClick={(event)=>tapEllipse(event, session)} />
                {
                    value && currentSession.id === session.id &&
                    <div className="flex flex-col z-20 bg-white dark:bg-black absolute -right-28 top-10 w-28 rounded border items-center">
                        <Link className="w-full" href={`/dashboard/events/sessions/${session.id}`} >
                            <div  className="w-full hover:bg-slate-100 dark:hover:text-blue-700 cursor-pointer py-2 flex justify-center border-b">
                                <span>Edit</span>
                            </div>
                        </Link>
                        <div onClick={()=>setDeleteMode(true)}  className="w-full hover:bg-slate-100 dark:hover:text-blue-700 cursor-pointer py-2 flex justify-center">
                            <span>Delete</span>
                        </div>
                    </div>
                }
            </div>
        </div>
        ))
    }
    <DeleteDialog onTap={()=>alert('Session Deleted')} message={message} title={`Delete session '${currentSession.name}'?`} value={deleteMode} setValue={setDeleteMode} />
    </div>
  )
}

export default SessionSide
