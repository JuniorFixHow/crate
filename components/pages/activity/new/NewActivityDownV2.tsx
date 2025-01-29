import AddButton from "@/components/features/AddButton";
import { updateActivity } from "@/lib/actions/activity.action";
import { IActivity } from "@/lib/database/models/activity.model";
import { ErrorProps } from "@/types/Types";
import { Alert } from "@mui/material";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

type NewActivityDownV2Props = {
    activity:IActivity
}

const NewActivityDownV2 = ({activity}:NewActivityDownV2Props) => {

    const [response, setResponse] = useState<ErrorProps>(null);
        const [loading, setLoading] = useState<boolean>(false);
        const [data, setData] = useState<Partial<IActivity>>({});
        const formRef =  useRef<HTMLFormElement>(null);
    
    
        const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
            const {name, value} = e.target;
            setData((prev)=>({
                ...prev,
                [name]:value
            }))
    }

     const handleUpdateActivity = async(e:FormEvent<HTMLFormElement>)=>{
            e.preventDefault();
            setResponse(null);
    
            try {
                setLoading(true);
                const body:Partial<IActivity> = {
                    _id:activity?._id,
                    name: data?.name || activity?.name,
                    type: data?.type || activity?.type,
                    frequency: data?.frequency || activity?.frequency,
                    startDate: data?.startDate || activity?.startDate,
                    endDate: data?.endDate || activity?.endDate,
                    startTime: data?.startTime || activity?.startTime,
                    endTime: data?.endTime || activity?.endTime,
                    description: data?.description || activity?.description,
                }
                const res = await updateActivity(body);
                setResponse(res);
                
            } catch (error) {
                console.log(error);
                setResponse({message:'Error occured updating activity.', error:true});
            }finally{
                setLoading(false);
            }
        }

  return (
    <form ref={formRef} onSubmit={handleUpdateActivity}  className='flex flex-col gap-5 mt-5' >
        <div className="flex flex-col gap-5 w-fit">
            <div className="flex flex-col gap-5 flex-1">
                <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem] font-semibold' >Activity title</span>
                    <input onChange={handleChange} defaultValue={activity?.name} name='name' required ={!activity} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                </div>

                {/* <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem] font-semibold' >Program</span>
                    <select
                        // required ={!activity}
                        onChange={handleChange}
                        name="type"
                        defaultValue={activity?.type}
                        className="border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none"
                    >
                        <option className="dark:bg-black" value="">select</option>
                        <option className="dark:bg-black" value="Sabbath School">Sabbath School</option>
                        <option className="dark:bg-black" value="Divine Service">Divine Service</option>
                        <option className="dark:bg-black" value="Children's Service">Children&apos;s Service</option>
                    </select>
                </div> */}
                <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem] font-semibold' >Fequency</span>
                    <select
                        required ={!activity}
                        onChange={handleChange}
                        name="frequency"
                        defaultValue={activity?.frequency}
                        className="border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none"
                    >
                        <option className="dark:bg-black" value="">select</option>
                        <option className="dark:bg-black" value="Daily">Daily</option>
                        <option className="dark:bg-black" value="Weekly">Weekly</option>
                        <option className="dark:bg-black" value="Biweekly">Biweekly</option>
                        <option className="dark:bg-black" value="Triweekly">Triweekly</option>
                        <option className="dark:bg-black" value="Monthly">Monthly</option>
                    </select>
                </div>

            </div>


            <div className="flex flex-col gap-5 flex-1">

                <div className="flex gap-12">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem] font-semibold' >Start Date</span>
                        <input  defaultValue={activity?.startDate} onChange={handleChange} name='startDate' required ={!activity} type='date' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem] font-semibold' >End Date</span>
                        <input  defaultValue={activity?.endDate} onChange={handleChange} name='endDate' type='date' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                </div>

                

                <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem] font-semibold' >Description</span>
                    <textarea defaultValue={activity?.description} onChange={handleChange} name='description'  className='rounded border px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                </div>
                
                {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
                }
                <div className="flex items-center gap-4">
                    <AddButton disabled={loading} type='submit' text={loading ? 'loading...' :'Update Activity'} noIcon smallText className='rounded py-1 w-fit self-end' />
                </div>
            </div>
        </div>
    </form>
  )
}

export default NewActivityDownV2