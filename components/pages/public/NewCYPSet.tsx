'use client'
import AddButton from "@/components/features/AddButton";
import SearchSelectCYPEvents from "@/components/features/SearchSelectCYPEvents";
import Subtitle from "@/components/features/Subtitle";
import { ErrorProps } from "@/types/Types";
import {  FormEvent,  useRef, useState } from "react"
import SectionSelector from "./section/SectionSelector";
import { Alert } from "@mui/material";
import { ICYPSet } from "@/lib/database/models/cypset.model";
import { createCpySet } from "@/lib/actions/cypset.action";
import { useAuth } from "@/hooks/useAuth";



const NewCYPSet = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [eventId, setEventId] = useState<string>('');
    const [cypsetId, setCypsetId] = useState<string>('');
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const {user} = useAuth();

    const formRef = useRef<HTMLFormElement>(null);
    const handleNewSet = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            if(user){

                const data:Partial<ICYPSet> ={
                    title,
                    eventId,
                    createdBy:user.userId
                } 
                const res = await createCpySet(data);
                setResponse(res);
                const cyp = res?.payload as ICYPSet;
                // console.log(cyp)
                setCypsetId(cyp._id);
                setInfoMode(true);
                formRef.current?.reset();
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured creating new set', error:true});
        }finally{
            setLoading(false);
        }
    }
    // console.log('CYP: ',cypsetId)
    // console.log(eventId)
    
  return (
    <div className="flex flex-col gap-8 bg-white h-[60vh] dark:bg-[#0F1214] dark:border w-full rounded p-6">
        <Subtitle text="New Set" />
        {
            cypsetId &&
            <SectionSelector infoMode={infoMode} setInfoMode={setInfoMode} cypsetId={cypsetId} />
        }
        <form ref={formRef} onSubmit={handleNewSet}  className="flex flex-col justify-between grow">
            <div className="flex flex-col gap-5">
                <SearchSelectCYPEvents className="w-fit" setSelect={setEventId} require isGeneric />
                <div className="flex flex-col max-w-[50%]">
                    <span className='text-slate-500 text-[0.8rem]' >Title</span>
                    <input onChange={(e)=>setTitle(e.target.value)} name='title' required  type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
                {
                    response?.message &&
                    <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
                }
                <AddButton type="submit" text={loading? "loading..." :"Proceed"} noIcon smallText className="rounded self-end" />
            </div>
        </form>
    </div>
  )
}

export default NewCYPSet
