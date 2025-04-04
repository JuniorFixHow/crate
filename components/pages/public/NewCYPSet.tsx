'use client'
import AddButton from "@/components/features/AddButton";
// import SearchSelectCYPEvents from "@/components/features/SearchSelectCYPEvents";
import Subtitle from "@/components/features/Subtitle";
import { ErrorProps } from "@/types/Types";
import {  FormEvent,  useEffect,  useRef, useState } from "react"
import SectionSelector from "./section/SectionSelector";
import { Alert } from "@mui/material";
import { ICYPSet } from "@/lib/database/models/cypset.model";
import { createCpySet } from "@/lib/actions/cypset.action";
import { useAuth } from "@/hooks/useAuth";
import SearchSelectEventsV4 from "@/components/features/SearchSelectEventsV4";
import { enqueueSnackbar } from "notistack";
import { canPerformAction, canPerformEvent, eventOrganizerRoles, questionSetRoles } from "@/components/auth/permission/permission";
import { useRouter } from "next/navigation";



const NewCYPSet = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [cypsetId, setCypsetId] = useState<string>('');
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const {user} = useAuth();
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);
    const creator = canPerformAction(user!, 'creator', {questionSetRoles}) || canPerformEvent(user!, 'creator', {eventOrganizerRoles});

    useEffect(()=>{
        if(user && !creator){
            router.replace('/dashboard/forbidden?p=Set Creator')
        }
    },[creator, user, router])

    const handleNewSet = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            if(user){

                const data:Partial<ICYPSet> ={
                    title,
                    description,
                    eventId,
                    churchId:user?.churchId,
                    createdBy:user.userId
                } 
                const res = await createCpySet(data);
                setResponse(res);
                const cyp = res?.payload as ICYPSet;
                // console.log(cyp)
                setCypsetId(cyp._id);
                setInfoMode(true);
                formRef.current?.reset();
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating new set', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }
    // console.log('CYP: ',cypsetId)
    // console.log(eventId)
    if(!creator) return;
    
  return (
    <div className="flex flex-col gap-8 bg-white h-[60vh] dark:bg-[#0F1214] dark:border w-full rounded p-6">
        <Subtitle text="New Set" />
        {
            cypsetId &&
            <SectionSelector infoMode={infoMode} setInfoMode={setInfoMode} cypsetId={cypsetId} />
        }
        <form ref={formRef} onSubmit={handleNewSet}  className="flex flex-col justify-between grow">
            <div className="flex flex-col gap-5">
                <SearchSelectEventsV4 setSelect={setEventId} require />
                <div className="flex flex-col md:max-w-[50%]">
                    <span className='text-slate-500 text-[0.8rem]' >Title</span>
                    <input onChange={(e)=>setTitle(e.target.value)} name='title' required  type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                </div>
                <div className="flex flex-col md:max-w-[50%]">
                    <span className='text-slate-500 text-[0.8rem]' >Description</span>
                    <textarea onChange={(e)=>setDescription(e.target.value)} name='description' required   className='border rounded px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
                {
                    response?.message &&
                    <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
                }
                {
                    creator &&
                    <AddButton type="submit" text={loading? "loading..." :"Proceed"} noIcon smallText className="rounded self-end" />
                }
            </div>
        </form>
    </div>
  )
}

export default NewCYPSet
