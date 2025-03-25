import AddButton from "@/components/features/AddButton"
import Subtitle from "@/components/features/Subtitle"
// import { useFetchClassministry } from "@/hooks/fetch/useClassministry"
import { useAuth } from "@/hooks/useAuth"
import { createClassministry, updateClassministry } from "@/lib/actions/classministry.action"
import { IClassministry } from "@/lib/database/models/classministry.model"
import { IClassMinistryExtended } from "@/types/Types"
import { Slide } from "@mui/material"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { enqueueSnackbar } from "notistack"
import { Dispatch, FormEvent, RefObject, SetStateAction, useRef, useState } from "react"

type NewClassMinistryProps = {
    inputRef:RefObject<HTMLDivElement | null>,
    newMode:boolean,
    setNewMode: Dispatch<SetStateAction<boolean>>,
    currentClassministry?:IClassministry;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IClassMinistryExtended[], Error>>;
    updater:boolean
}

const NewClassMinistry = ({inputRef, newMode, refetch, updater, setNewMode, currentClassministry}:NewClassMinistryProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const {user} = useAuth();
    const formRef = useRef<HTMLFormElement>(null);

    const handleNewMinistry = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const body:Partial<IClassministry> = {
                title,
                churchId:user?.churchId
            }
            const response = await createClassministry(body);
            enqueueSnackbar(response?.message, {variant:'success'});
            formRef.current?.reset();
            refetch();
            setNewMode(false);
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating the ministry', {variant:'error'})
        }finally{
            setLoading(false);
        }
    }

    const handleUpdateMinistry = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const body:Partial<IClassministry> = {
                _id:currentClassministry?._id,
                title: title|| currentClassministry?.title,
            }
            const response = await updateClassministry(body);
            enqueueSnackbar(response?.message, {variant:'success'});
            refetch();
            setNewMode(false);
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating the ministry', {variant:'error'})
        }finally{
            setLoading(false);
        }
    }
    if(!newMode) return;
  return (
    <div className="flex absolute z-10 right-8">

        <Slide container={inputRef.current} in={newMode} direction='left' >
            <div className="flex border w-80 flex-col p-5 gap-6 bg-white dark:bg-transparent dark:border shadow-md rounded-md">
                <Subtitle text={currentClassministry? "Update Ministry":"Add Ministry"} />
                <form onSubmit={currentClassministry ? handleUpdateMinistry:handleNewMinistry} ref={formRef}  className="flex flex-col gap-5">
                    <input onChange={(e)=>setTitle(e.target.value)} required={!currentClassministry} defaultValue={currentClassministry?.title} type="text" className="outline-none border-b border-b-slate-400 px-2 text-slate-500 placeholder:italic placeholder:text-sm" placeholder="ministry title" />
                    <div className="flex justify-end items-center gap-3">
                        <AddButton onClick={()=>setNewMode(false)} disabled={loading} text="Cancel" noIcon isDanger smallText className="rounded" type="button" />
                        <AddButton className={`rounded ${currentClassministry && !updater && 'hidden'}`} disabled={loading} text={loading? 'loading' : currentClassministry? 'Update' : "Proceed"} noIcon smallText />
                    </div>
                </form>
            </div>
        </Slide>
    </div>
  )
}

export default NewClassMinistry