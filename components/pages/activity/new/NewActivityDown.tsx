import AddButton from "@/components/features/AddButton"
import Subtitle from "@/components/features/Subtitle"
import { today } from "@/functions/dates"
import { useAuth } from "@/hooks/useAuth"
import { createActivity, updateActivity } from "@/lib/actions/activity.action"
import { IActivity } from "@/lib/database/models/activity.model"
import { ErrorProps } from "@/types/Types"
import { Alert, Modal } from "@mui/material"
import { useRouter } from "next/navigation"
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from "react"

type NewActivityDownProps = {
    activity?:IActivity|null;
    newMode:boolean;
    setNewMode:Dispatch<SetStateAction<boolean>>
}

const NewActivityDown = ({newMode, setNewMode, activity}:NewActivityDownProps) => {
    const [response, setResponse] = useState<ErrorProps>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Partial<IActivity>>({});
    const formRef =  useRef<HTMLFormElement>(null);

    const router = useRouter();
    const {user} = useAuth();

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleClose = ()=>{
        setNewMode(false);
    }

    const handleNewActivity = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);

        try {
            setLoading(true);
            const body:Partial<IActivity> = {
                ...data,
                churchId:user?.churchId,
                creatorId:user?.userId,
            }
            const res = await createActivity(body);
            const payload = res?.payload as IActivity;
            setResponse(res);
            if(res?.code === 201){
                router.push(`/dashboard/activities/${payload?._id}`);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured creating activity.', error:true});
        }finally{
            setLoading(false);
        }
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

    <Modal
        open={newMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <div className='flex size-full items-center justify-center'>
            <div className="flex bg-white p-6 rounded flex-col gap-4 dark:bg-[#0F1214]">
                <Subtitle className="dark:text-white" text="New Activity" />
                <form ref={formRef} onSubmit={activity? handleUpdateActivity : handleNewActivity}  className='flex flex-col gap-5 mt-5' >

                    <div className="flex flex-col gap-5 md:flex-row md:justify-between md:items-stretch">
                        <div className="flex flex-col gap-5 flex-1">
                            <div className="flex flex-col">
                                <span className='text-slate-500 text-[0.8rem] font-semibold' >Activity name</span>
                                <input onChange={handleChange} defaultValue={activity?.name} name='name' required ={!activity} type="text" className='border-b w-fit px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
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
                                    <input min={today()} defaultValue={activity?.startDate} onChange={handleChange} name='startDate' required ={!activity} type='date' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                                </div>
                                <div className="flex flex-col">
                                    <span className='text-slate-500 text-[0.8rem] font-semibold' >End Date</span>
                                    <input min={today()} defaultValue={activity?.endDate} onChange={handleChange} name='endDate' type='date' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                                </div>
                            </div>

                            {/* <div className="flex gap-12">
                                <div className="flex flex-col">
                                    <span className='text-slate-500 text-[0.8rem] font-semibold' >Start Time <small className="text-[0.6rem]" >(The time this program often starts)</small> </span>
                                    <input onChange={handleChange} defaultValue={activity?.startTime} name='startTime' required ={!activity} type='time' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                                </div>
                                <div className="flex flex-col">
                                    <span className='text-slate-500 text-[0.8rem] font-semibold' >End Time <small className="text-[0.6rem]" >(The time this program often ends)</small> </span>
                                    <input onChange={handleChange} defaultValue={activity?.endTime} name='endTime' required ={!activity} type='time' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                                </div>
                            </div> */}

                            <div className="flex flex-col">
                                <span className='text-slate-500 text-[0.8rem] font-semibold' >Description</span>
                                <textarea defaultValue={activity?.description} onChange={handleChange} name='description'  className='rounded border px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                            </div>
                            
                            {
                                response?.message &&
                                <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
                            }
                            <div className="flex items-center gap-4">
                                <AddButton disabled={loading} onClick={handleClose} type='button' text="Cancel" isCancel noIcon smallText className='rounded py-1 w-fit self-end' />
                                <AddButton disabled={loading} type='submit' text={loading ? 'loading...' :'Create Activity'} noIcon smallText className='rounded py-1 w-fit self-end' />
                            </div>
                        </div>
                    </div>



                </form>
            </div>   
        </div>
    </Modal>

  )
}

export default NewActivityDown