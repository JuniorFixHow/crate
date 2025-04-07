'use client'
import { canPerformAction, canPerformEvent, eventOrganizerRoles, eventRegistrationRoles, isSuperUser } from "@/components/auth/permission/permission";
import AddButton from "@/components/features/AddButton";
import SearchSelectEventsV4 from "@/components/features/SearchSelectEventsV4"
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import HubclassModal from "./HubclassModal";
import { IHubclass } from "@/lib/database/models/hubclass.model";
import SearchSelectHubClassesByEvent from "@/components/features/SearchSelectHubClassesByEvent";
import ClassContent from "./ClassContent";
import HubSessions from "./hubsession/HubSession";

const ChildrenContent = () => {
    const {user} = useAuth();
    const [eventId, setEventId] = useState<string>('');
    const [title, setTitle] = useState<string>('Classes');
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [currentClass, setCurrentClass] = useState<IHubclass|null>(null);
    // const [classId, setClassId] = useState<string>('');
    const router = useRouter();
    const titles = ['Classes', 'Attendance'];

    const su = isSuperUser(user!);
    const updater = canPerformAction(user!, 'updater', {eventRegistrationRoles}) || canPerformEvent(user!, 'updater', {eventOrganizerRoles});

    useEffect(()=>{
        if(user && !su){
            router.replace('dashboard/forbidden')
        }
    },[router, su, user])

    // console.log(eventId)

    const handleOpenNew = ()=>{
        setCurrentClass(null);
        setInfoMode(true);
    }

  return (
    <div className="table-main2" >
        <HubclassModal currentClass={currentClass} setCurrentClass={setCurrentClass} infoMode={infoMode} setInfoMode={setInfoMode} updater={updater} />
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:justify-between flex-wrap">
            <div className="flex flex-col gap-4 md:flex-row md:gap-10">
                {
                    title === 'Classes' &&
                    <SearchSelectEventsV4 setSelect={setEventId} />
                }
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

            <div className="flex flex-col md:items-center md:flex-row gap-4">
                {
                    !infoMode &&
                    <SearchSelectHubClassesByEvent eventId={eventId} setCurrentHubClass={setCurrentClass} />
                }
                {
                    updater &&
                    <AddButton onClick={handleOpenNew} noIcon smallText className="rounded justify-center w-fit py-2" text="Add Class" />
                }
            </div>

        </div>

        {
            title === 'Classes' &&
            <ClassContent eventId={eventId} updater={updater} setCurrentClass={setCurrentClass} currentClass={currentClass!} />
        }
        {
            title === 'Attendance' &&
            <HubSessions/>
        }
    </div>
  )
}

export default ChildrenContent