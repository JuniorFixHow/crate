'use client'
import DeleteDialog from "@/components/DeleteDialog"
import Subtitle from "@/components/features/Subtitle"
import { searchSessionV2 } from "@/functions/search"
// import { BooleanStateProp } from "@/types/Types"
import Link from "next/link"
import { ComponentProps, Dispatch,  SetStateAction, useState } from "react"
// import { FaEllipsisV } from "react-icons/fa"
import { IClasssession } from "@/lib/database/models/classsession.model"
import { deleteCSession } from "@/lib/actions/classsession.action"
import { enqueueSnackbar } from "notistack"
import SearchSelectClassministries from "@/components/features/SearchSelectClassministries"
import SearchSelectActivity from "@/components/features/SearchSelectActivity"
import SearchSelectClassV2 from "@/components/features/SearchSelectClassV2"
import '@/components/features/customscroll.css';
import { getActivityStatus } from "../../session/fxn"
import { RiPencilFill } from "react-icons/ri"
import { IoMdTrash } from "react-icons/io"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"


export type SessionSideV2Props = ComponentProps<'div'> & {
    setCurrentSession:Dispatch<SetStateAction<IClasssession|null>>,
    currentSession:IClasssession,
    selectedTime:string,
    minstryId:string,
    setMinistryId:Dispatch<SetStateAction<string>>,
    sessions:IClasssession[]
    setSelectedTime:Dispatch<SetStateAction<string>>,
    refetch:(options?: RefetchOptions)=>Promise<QueryObserverResult<IClasssession[], Error>>;
    sessionDeleter:boolean;
    sessionUpdater:boolean;
}
const SessionSideV2 = ({
    currentSession, sessions, 
    selectedTime, minstryId, 
    setMinistryId, setSelectedTime, 
    setCurrentSession,
    sessionDeleter, sessionUpdater,
    className}:SessionSideV2Props) => {

     const [deleteMode, setDeleteMode] = useState<boolean>(false);
     const [classMinistryId, setClassMinistryId] = useState<string>('');
     const [activityId, setActivityId] = useState<string>('');
     
    const message = 'Deleting a session will delete its subsequent attendance records. Continue?'
    // const tapEllipse = (event:MouseEvent<SVGElement>, item:IClasssession)=>{
    //     event.stopPropagation();
    //     setCurrentSession(item);
    //     setValue(prevValue => !prevValue);
    // }
    const handleClickSession = (session:IClasssession)=>{
        setCurrentSession(session);
        // setValue(false);
    }

    const handleDeleteSession = async()=>{
        try {
            if(currentSession){
                const res = await deleteCSession(currentSession._id);
                setDeleteMode(false);
                setCurrentSession(null);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting the session', {variant:'error'})
        }
    }
   
  return (
    <div className='flex flex-row max-w-[90vw] scrollbar-custom overflow-x-scroll lg:overflow-hidden lg:flex-col lg:w-52 rounded gap-5 py-4 px-2 bg-white border dark:bg-[#0F1214]' >
      <Subtitle className="hidden md:block" text="Sessions" />
      <div className="flex  lg:flex-col gap-3 pb-4 border-b">
        <SearchSelectClassministries width={190} setSelect={setClassMinistryId} />
        {
            classMinistryId && <SearchSelectActivity width={190} minId={classMinistryId} setSelect={setActivityId} />
        }
        {
            activityId && <SearchSelectClassV2 width={190} activityId={activityId} setSelect={setMinistryId} />
        }
        
        <select onChange={(e)=>setSelectedTime(e.target.value)}  className="bg-transparent h-fit py-2 lg:py-1 border rounded outline-none" defaultValue='All' >
            <option className="dark:bg-[#0F1214]" value="All">All</option>
            <option className="dark:bg-[#0F1214]" value="Morning">Morning</option>
            <option className="dark:bg-[#0F1214]" value="Afternoon">Afternoon</option>
            <option className="dark:bg-[#0F1214]" value="Evening">Evening</option>
            <option className="dark:bg-[#0F1214]" value="Dawn">Dawn</option>
        </select>
      </div>
      {
        searchSessionV2(selectedTime, minstryId, sessions)?.map((session)=>(
        <div onClick={()=>handleClickSession(session)} key={session?._id}    className="flex flex-row items-center relative">
            <div className={`absolute ${currentSession?._id === session?._id ? 'block':'hidden'} h-full z-10 left-[-0.4rem] px-[1px] bg-red-700 dark:bg-blue-700`}/>
            <div   className={`flex relative w-full bg-[#F4F4F4] ${currentSession?._id === session?._id && 'border-red-700 dark:border-blue-700'} dark:bg-[#0F1214] p-1 border cursor-pointer  rounded flex-row justify-between items-center ${className}`} >
                <div className="flex flex-col w-[90%]">
                    <span className="font-semibold text-ellipsis w-full overflow-hidden whitespace-nowrap" >{session?.name}</span>
                    <div className="flex flex-row gap-2 items-center">
                        <small className="font-medium" >Status:</small>
                        <small>{getActivityStatus(session.from!, session.to!)}</small>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="flex flex-row gap-2 items-center">
                            <small className="font-medium" >Date</small>
                            <small className="text-[0.8rem]" > {new Date(session.from!).toLocaleDateString()}</small>
                        </div>
                        <div className="flex items-center">
                            {
                                sessionUpdater &&
                                <Link className="w-full" href={`/dashboard/ministries/sessions/${session?._id}`} >
                                    <RiPencilFill size={20} className="text-blue-600" />
                                </Link>
                            }
                            {
                                sessionDeleter &&
                                <IoMdTrash onClick={()=>setDeleteMode(true)} size={20} className="text-red-600 cursor-pointer" />
                            }

                        </div>
                    </div>
                </div>
                {/* <FaEllipsisV className="z-50" onClick={(event)=>tapEllipse(event, session)} />
                {
                    value && currentSession?._id === session?._id &&
                    <div className="flex flex-col z-20 bg-white dark:bg-[#0F1214] absolute -right-28 top-10 w-28 rounded border items-center">
                        <Link className="w-full" href={`/dashboard/events/sessions/${session?._id}`} >
                            <div  className="w-full hover:bg-slate-100 dark:hover:text-blue-700 cursor-pointer py-2 flex justify-center border-b">
                                <span>Edit</span>
                            </div>
                        </Link>
                       
                        <div onClick={()=>setDeleteMode(true)}  className="w-full hover:bg-slate-100 dark:hover:text-blue-700 cursor-pointer py-2 flex justify-center">
                            <span>Delete</span>
                        </div>
                    </div>
                } */}
            </div>
        </div>
        ))
    }
    <DeleteDialog onTap={handleDeleteSession} message={message} title={`Delete session '${currentSession?.name}'?`} value={deleteMode} setValue={setDeleteMode} />
    </div>
  )
}

export default SessionSideV2
