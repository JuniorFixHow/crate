'use client'
import AddButton from "@/components/features/AddButton";
import {  useFetchSectionsWithQuestions } from "@/hooks/fetch/useSection";
import { createSection } from "@/lib/actions/section.action";
import { ISection } from "@/lib/database/models/section.model";
import { ErrorProps } from "@/types/Types";
import { Alert, Modal } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react"
import SectionSelectCenter from "./SectionSelectCenter";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";
import { canPerformAction, canPerformEvent, eventOrganizerRoles, questionSectionRoles } from "@/components/auth/permission/permission";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

type SectionSelectorProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    cypsetId:string,
    refetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<ISection[], Error>>
}

const SectionSelector = ({infoMode, refetch, setInfoMode, cypsetId}:SectionSelectorProps) => {
    const {user} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [choice, setChoice] = useState<'One'|'Two'|''>('');
    const [openSelect, setOpenSelect] = useState<boolean>(false);
    const [sectionId, setSectionId] = useState<string>('');

    const {sections} = useFetchSectionsWithQuestions();
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);
    const creator = canPerformAction(user!, 'creator', {questionSectionRoles}) || canPerformEvent(user!, 'creator', {eventOrganizerRoles});

    // useEffect(()=>{
    //     if(user && !creator){
    //         console.log('Out of bounds');
    //     }
    // },[user, creator])

    const handleClose = ()=>{
        setInfoMode(false);
    }

    const handleNewSection = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const data:Partial<ISection> = {
                cypsetId,
                title,
                churchId:user?.churchId
            }
            const res = await createSection(data);
            const section = res?.payload as ISection; 
            // setResponse(res)
            setSectionId(section._id);
            formRef.current?.reset();
            if(choice === 'One'){
                router.push(`/dashboard/events/public/sections/new/${section?._id}`);
            }
            else if(choice === 'Two'){
                setOpenSelect(true);
                // setInfoMode(false);
            }
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            setInfoMode(false);
            refetch!();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating section', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }

    if(!user) return;
  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex-center"
        >
        <div className='flex flex-col gap-8 bg-white  dark:bg-[#0F1214] dark:border w-[90%] md:w-[60%] rounded p-6'>
            <SectionSelectCenter openSelect={openSelect} setOpenSelect={setOpenSelect} sectionId={sectionId} />
            <form onSubmit={handleNewSection} ref={formRef}  className="flex flex-col gap-5 grow">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >Create Section</span>
                <div className="flex grow flex-col justify-between gap-6">

                    <div className="flex flex-col gap-6 pb-4">
                        <div className="flex flex-col w-fit">
                            <span className='text-slate-500 text-[0.8rem]' >Title</span>
                            <input onChange={(e)=>setTitle(e.target.value)} name='title' required  type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>   
                    </div>

                    <div className="flex w-full items-start justify-center gap-8">
                        <div onClick={()=>setChoice('One')}  className={`flex-center ${choice === 'One' && 'border-blue-700 border'} hover:border-blue-700 hover:border cursor-pointer flex-col gap-5 p-3 bg-white shadow-md dark:bg-[#0F1214] rounded dark:border`}>
                            <Image src='/undraw_duplicate_re_d39g.svg' height={150} width={150} alt="new" />
                            <span className="hover:text-blue-600 dark:text-white dark:hover:text-blue-700" >Create New</span>
                        </div>
                        {
                            sections.length > 0 &&
                            <div onClick={()=>setChoice('Two')}  className={`flex-center ${choice === 'Two' && 'border-blue-700 border'} hover:border-blue-700 hover:border cursor-pointer flex-col gap-5 p-3 bg-white shadow-md dark:bg-[#0F1214] rounded dark:border`}>
                                <Image  src='/undraw_add_notes_re_ln36.svg' height={0.5} style={{height:'6.5rem'}} width={150} alt="new" />
                                <span className="hover:text-blue-600 dark:text-white dark:hover:text-blue-700" >Copy</span>
                            </div>
                        }
                    </div>

                    <div className="flex flex-col gap-4">
                        {
                            response?.message &&
                            <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
                        }

                        <div className="flex flex-row items-center justify-end gap-6">
                            {
                                choice !== '' && creator &&
                                <AddButton disabled={loading} type='submit'  className='rounded' text={loading ? 'loading...' :'Proceed'} smallText noIcon />
                            }
                            <AddButton type="button" disabled={loading} className='rounded' text='Do This Later' isCancel onClick={handleClose} smallText noIcon />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    </Modal>
  )
}

export default SectionSelector
