'use client'
import { updateSection } from "@/lib/actions/section.action"
import { ISection } from "@/lib/database/models/section.model"
import { ErrorProps } from "@/types/Types"
import { FormEvent, useState } from "react"
import { FaPen } from "react-icons/fa"

type SectionTitleChangerProps = {
    section:ISection
}

const SectionTitleChanger = ({section}:SectionTitleChangerProps) => {
    const [editMode, setEditMode] =useState<boolean>(false);
    const [loading, setLoading] =useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [title, setTitle] = useState<string>('');

    const handleNewTitle = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            const data:Partial<ISection> = {
                ...section, title
            } 
            const res = await updateSection(section._id, data);
            setResponse(res);
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured', error:true})
        }finally{
            setLoading(false);
        }
    }

  return (
    <form onSubmit={handleNewTitle} className="flex flex-col gap-1" >
        {
            !editMode ?
            <div className="flex gap-2">
                <span className="text-[0.8rem] max-w-[18rem] text-ellipsis overflow-hidden whitespace-nowrap" >{section?.title}</span>
                <FaPen onClick={()=>setEditMode(true)}  className="cursor-pointer" size={12} />
            </div>
            :
            <div className="flex flex-col gap-1">
                <input onChange={(e)=>setTitle(e.target.value)}  className="bg-transparent border-b text-[0.7rem] outline-none" type="text" defaultValue={section?.title} required name="title" />
                {
                    response?.message &&
                    <small className={`text-[0.7rem] ${response.error ? 'text-red-400':'text-green-600'}`} >{response.message}</small>
                }
                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={()=>setEditMode(false)}  className="border w-fit text-[0.7rem] px-1 dark:bg-black rounded dark:border text-white" >Cancel</button>
                    <button type="submit" disabled={loading} className="w-fit text-[0.7rem] px-1 border dark:bg-black rounded dark:border text-white" >{loading? 'loading...':'Save'}</button>
                </div>
            </div>
        }

    </form>
  )
}

export default SectionTitleChanger