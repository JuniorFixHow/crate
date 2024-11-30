'use client'
import AddButton from '@/components/features/AddButton'
import { updateGroup } from '@/lib/actions/group.action'
import { IGroup } from '@/lib/database/models/group.model'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'
import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react'

type SingleGroupDownProps = {
    currentGroup:IGroup,
    setCurrentGroup:Dispatch<SetStateAction<IGroup|null>>
}

const SingleGroupDown = ({currentGroup, setCurrentGroup}:SingleGroupDownProps) => {
    const [data, setData] = useState<Partial<IGroup>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} =  e.target;
        setData((prev)=>({
            ...prev, [name]:value
        }))
    }

    const handleUpdate = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            if(currentGroup){
                const body:Partial<IGroup> = {
                    name:data.name || currentGroup.name,
                    type: data.type || currentGroup.type
                }
                const res = await updateGroup(currentGroup._id, body);
                // console.log('Body: ', body)
                setCurrentGroup(res);
            }
            setResponse({message:'Group updated successfully', error:false})
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured updating group', error:true})
        }finally{
            setLoading(false);
        }
    }

    // console.log(currentGroup.type === 'Group')

  return (
    <form onSubmit={handleUpdate}  className='flex flex-col gap-5 mt-5' >
        <div className="flex flex-col">
            <span className='text-slate-500 text-[0.8rem] font-semibold' >Group name</span>
            <input onChange={handleChange} defaultValue={currentGroup?.name} name='name' type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
        </div>

        <div className="flex flex-col gap-2">
            <span className='text-slate-500 text-[0.8rem] font-semibold' >Type</span>
            {
                currentGroup &&
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input onChange={handleChange} defaultChecked={currentGroup?.type === 'Group'} type="radio" name="type" value='Group' />
                        <span className='text-[0.8rem] dark:text-white' >Group</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} defaultChecked={currentGroup?.type === 'Family'} type="radio" name="type" value='Family' />
                        <span className='text-[0.8rem] dark:text-white' >Family</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} defaultChecked={currentGroup?.type === 'Couple'} type="radio" name="type" value='Couple' />
                        <span className='text-[0.8rem] dark:text-white' >Couple</span>
                    </div>
                </div>
            }
        </div>

        {
            response?.message &&
            <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
        }

        <AddButton type='submit' disabled={loading} text={loading ?'loading...' :'Update Group'} noIcon smallText className='rounded py-1 w-fit self-end' />
    </form>
  )
}

export default SingleGroupDown