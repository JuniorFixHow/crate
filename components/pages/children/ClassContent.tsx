'use client'

import AddButton from "@/components/features/AddButton"
import { IHubclass } from "@/lib/database/models/hubclass.model"
import { Dispatch, SetStateAction, useState } from "react"
import HubMembersTable from "./HubMembersTable"
import { useFetchHubClasses } from "@/hooks/fetch/useHubclass"
import HubclassModal from "./HubclassModal"
import { enqueueSnackbar } from "notistack"
import { deleteHubclass } from "@/lib/actions/hubclass.action"
import DeleteDialog from "@/components/DeleteDialog"
import HubLeadersTable from "./HubLeadersTable"

type ClassContentProps = {
    currentClass:IHubclass;
    setCurrentClass:Dispatch<SetStateAction<IHubclass|null>>
    updater:boolean;
    eventId:string;
}

const ClassContent = ({currentClass,  eventId, updater, setCurrentClass}:ClassContentProps) => {
    const [title, setTitle] = useState<string>('Members');
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const {refetch, loading} = useFetchHubClasses(eventId);

    const deleteClass = async()=>{
        try {
            if(currentClass){
                const res = await deleteHubclass(currentClass?._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting class', {variant:'error'})
        }finally{
            setDeleteMode(false);
        }
    }
    
    const titles = ['Members', 'Leaders'];
    const message = `You're about to delete the '${currentClass?.title}' class. Proceed?`;

    // console.log('Current Class: ', currentClass);

  return (
    <div className="shadow-md flex flex-col gap-8 bg-white dark:bg-transparent dark:border rounded-md px-2 md:px-8 py-4" >
        <HubclassModal currentClass={currentClass} setCurrentClass={setCurrentClass} updater={updater} infoMode={infoMode} setInfoMode={setInfoMode} />
        <DeleteDialog onTap={deleteClass} value={deleteMode} setValue={setDeleteMode} message={message} title={`Delete ${currentClass?.title}`} />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            {
                currentClass &&
                <div className="flex gap-4">
                    <AddButton onClick={()=>setInfoMode(true)} type="button" text="Edit Class" noIcon smallText className="rounded justify-center py-1" />
                    <AddButton type="button" onClick={()=>setDeleteMode(true)} isDanger text="Delete Class" noIcon smallText className="rounded justify-center py-1" />
                </div>
            }
        </div>
        {
            title === 'Members' &&
            <HubMembersTable eventId={eventId} refetch={refetch} loading={loading} hubClass={currentClass} />
        }
        {
            title === 'Leaders' &&
            <HubLeadersTable hubClass={currentClass} />
        }
    </div>
  )
}

export default ClassContent