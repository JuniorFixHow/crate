import AddButton from "@/components/features/AddButton";
import { createMinistry, updateMinistry } from "@/lib/actions/ministry.action";
// import { IMember } from "@/lib/database/models/member.model";
import { IMinistry } from "@/lib/database/models/ministry.model";
// import { ErrorProps } from "@/types/Types";
import {  Tooltip } from "@mui/material";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { LuInfo } from "react-icons/lu";
import { enqueueSnackbar } from "notistack";

type NewActivityDownV3Props = {
    ministry?:IMinistry;
    members?:string[];
    updater:boolean,
}

const NewActivityDownV3 = ({ministry, updater, members}:NewActivityDownV3Props) => {

    // const [response, setResponse] = useState<ErrorProps>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Partial<IMinistry>>({});
    const formRef =  useRef<HTMLFormElement>(null);

    const {user} = useAuth();
    const router = useRouter();

    const path = usePathname();

    const activityId = path?.split('/')[3];

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    // console.log(members?.length)

   const handleNewMinistry = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    // setResponse(null)
    try {
        setLoading(true);
        if(members && members?.length <= 0 ){
            enqueueSnackbar('Select at least one member', {variant:'error'});
        }else{
            const body:Partial<IMinistry> = {
                ...data,
                churchId:user?.churchId,
                activityId,
                members, leaders:[]
            }
            const res = await createMinistry(body);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            // setResponse(res);
            router.back();
        }
    } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured creating class', {variant:'error'});
    }finally{
        setLoading(false);
    }
   }

   const handleUpdateMinistry = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    // setResponse(null)
    try {
        setLoading(true);
        const body:Partial<IMinistry> = {
            _id: ministry?._id,
            name: data?.name || ministry?.name,
            startTime: data?.startTime || ministry?.startTime,
            endTime: data?.endTime || ministry?.endTime,
            description: data?.description || ministry?.description,
        }
        const res = await updateMinistry(body);
        enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
        // setResponse(res);
    } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured updating class', {variant:'error'})
    }finally{
        setLoading(false);
    }
   }

  return (
    <form ref={formRef} onSubmit={ministry ? handleUpdateMinistry : handleNewMinistry}  className='flex flex-col gap-5 mt-5' >
        <div className="flex flex-col gap-5 w-fit">
            <div className="flex flex-col gap-5 flex-1">
                <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem] font-semibold' >Class title</span>
                    <input onChange={handleChange} defaultValue={ministry?.name} name='name' required ={!ministry} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                </div>

                
                <div className="flex gap-12">
                    <div className="flex flex-col">
                        <div className="flex gap-1 items-center">
                            <span className='text-slate-500 text-[0.8rem] font-semibold' >Start Time</span>
                            <Tooltip title='The time this program often starts' ><LuInfo size={13} /></Tooltip>
                        </div>
                        <input onChange={handleChange} defaultValue={ministry?.startTime} name='startTime' required ={!ministry} type='time' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-1 items-center">
                            <span className='text-slate-500 text-[0.8rem] font-semibold' >End Time</span>
                            <Tooltip title='The time this program often ends' ><LuInfo size={13} /></Tooltip>
                        </div>
                        <input onChange={handleChange} defaultValue={ministry?.endTime} name='endTime' required ={!ministry} type='time' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                </div>

            </div>


            <div className="flex flex-col gap-5 flex-1">

                <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem] font-semibold' >Description</span>
                    <textarea defaultValue={ministry?.description} onChange={handleChange} name='description'  className='rounded border px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                </div>
                
                {/* {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
                } */}
                <div className="flex items-center gap-4">
                    <AddButton onClick={()=>router.back()} text="Cancel" smallText noIcon className="rounded py-1" isCancel type="button" />
                    <AddButton disabled={loading} type='submit' text={loading ? 'loading...' : ministry ? 'Update Class':'Create Class'} noIcon smallText className={`${!updater && 'hidden'} rounded py-1 w-fit self-end`} />
                </div>
            </div>
        </div>
    </form>
  )
}

export default NewActivityDownV3