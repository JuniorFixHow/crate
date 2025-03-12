'use client'
import { updateCYPSet } from "@/lib/actions/cypset.action"
import { ICYPSet } from "@/lib/database/models/cypset.model"
// import { ErrorProps } from "@/types/Types"
import { enqueueSnackbar } from "notistack"
import { FormEvent, useState } from "react"
import { FaPen } from "react-icons/fa"

type PublicTitleChangerProps = {
    cyp:ICYPSet
}

const PublicTitleChanger = ({cyp}:PublicTitleChangerProps) => {
    const [editMode, setEditMode] =useState<boolean>(false);
    const [loading, setLoading] =useState<boolean>(false);
    // const [response, setResponse] = useState<ErrorProps>(null);
    const [title, setTitle] = useState<string>('');

    const handleNewTitle = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            const data:Partial<ICYPSet> = {
                ...cyp, title
            } 
            const res = await updateCYPSet(cyp._id, data);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured changing title', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }

  return (
    <form onSubmit={handleNewTitle} className="flex flex-col gap-1" >
        {
            !editMode ?
            <div className="flex gap-2">
                <span className="text-[0.8rem] max-w-[18rem] text-ellipsis overflow-hidden whitespace-nowrap" >{cyp?.title}</span>
                <FaPen onClick={()=>setEditMode(true)}  className="cursor-pointer" size={12} />
            </div>
            :
            <div className="flex flex-col gap-1">
                <input onChange={(e)=>setTitle(e.target.value)}  className="bg-transparent border-b text-[0.7rem] outline-none" type="text" defaultValue={cyp?.title} required name="title" />
                {/* {
                    response?.message &&
                    <small className={`text-[0.7rem] ${response.error ? 'text-red-400':'text-green-600'}`} >{response.message}</small>
                } */}
                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={()=>setEditMode(false)}  className="border w-fit text-[0.7rem] px-1 dark:bg-black rounded dark:border text-white" >Cancel</button>
                    <button type="submit" disabled={loading} className="w-fit text-[0.7rem] px-1 border dark:bg-black rounded dark:border text-white" >{loading? 'loading...':'Save'}</button>
                </div>
            </div>
        }

    </form>
  )
}

export default PublicTitleChanger