'use client'
import AddButton from '@/components/features/AddButton'
import { createGroup } from '@/lib/actions/group.action'
import { IGroup } from '@/lib/database/models/group.model'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'

type NewGroupDownProps = {
    members:string[],
    eventId:string
}

const NewGroupDown = ({members, eventId}:NewGroupDownProps) => {
    const [data, setData] = useState<Partial<IGroup>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleNewGroup = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const body:Partial<IGroup> = {
                ...data,
                members,
                eventId
            }
            if(data.type==='Couple' && members.length > 2){
                setResponse({message:'A couple group can only have two members', error:true})
            }else{
                const res:ErrorProps = await createGroup(body);
                setResponse(res);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured creating group', error:true, payload:{}, code:500});
        }finally{
            setLoading(false);
        }
    }

  return (
    <form ref={formRef} onSubmit={handleNewGroup}  className='flex flex-col gap-5 mt-5' >
        <div className="flex flex-col">
            <span className='text-slate-500 text-[0.8rem] font-semibold' >Group name</span>
            <input onChange={handleChange} name='name' required type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
        </div>

        <div className="flex flex-col gap-2">
            <span className='text-slate-500 text-[0.8rem] font-semibold' >Type</span>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input onChange={handleChange} required type="radio" name="type" value='Group' />
                    <span className='text-[0.8rem] dark:text-white' >Group</span>
                </div>
                <div className="flex gap-2">
                    <input onChange={handleChange} required type="radio" name="type" value='Family' />
                    <span className='text-[0.8rem] dark:text-white' >Family</span>
                </div>
                <div className="flex gap-2">
                    <input onChange={handleChange} required type="radio" name="type" value='Couple' />
                    <span className='text-[0.8rem] dark:text-white' >Couple</span>
                </div>
            </div>
        </div>
        {
            response?.message &&
            <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
        }
        <AddButton disabled={loading} type='submit' text={loading ? 'loading...' :'Create Group'} noIcon smallText className='rounded py-1 w-fit self-end' />
    </form>
  )
}

export default NewGroupDown