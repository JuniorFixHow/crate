import AddButton from "@/components/features/AddButton"
import Subtitle from "@/components/features/Subtitle"
import { updateMinistry } from "@/lib/actions/ministry.action"
import { IActivity } from "@/lib/database/models/activity.model"
import { IMinistry } from "@/lib/database/models/ministry.model"
import { ErrorProps } from "@/types/Types"
import { Alert, Modal } from "@mui/material"
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from "react"

type NewActivityDownV4Props = {
    ministry?:IMinistry|null;
    editMode:boolean;
    setEditMode:Dispatch<SetStateAction<boolean>>
}

const NewActivityDownV4 = ({editMode, setEditMode, ministry}:NewActivityDownV4Props) => {
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

    const handleClose = ()=>{
        setEditMode(false);
    }

    


    const handleUpdateMinistry = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null)
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
            setResponse(res);
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured updating class', error:true});
        }finally{
            setLoading(false);
        }
    }

  return (

    <Modal
        open={editMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <div className='flex size-full items-center justify-center'>
            <div className="flex bg-white p-6 rounded flex-col gap-4 dark:bg-[#0F1214]">
                <Subtitle text="Edit Class" className="dark:text-white" />
                <form ref={formRef} onSubmit={handleUpdateMinistry}  className='flex flex-col gap-5 mt-5' >

                    <div className="flex flex-col gap-5 w-fit">
                        <div className="flex flex-col gap-5 flex-1">
                            <div className="flex flex-col">
                                <span className='text-slate-500 text-[0.8rem] font-semibold' >Class title</span>
                                <input onChange={handleChange} defaultValue={ministry?.name} name='name' required ={!ministry} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                            </div>

                            
                            <div className="flex gap-12">
                                <div className="flex flex-col">
                                    <span className='text-slate-500 text-[0.8rem] font-semibold' >Start Time <small className="text-[0.6rem]" >(The time this program often starts)</small> </span>
                                    <input onChange={handleChange} defaultValue={ministry?.startTime} name='startTime' required ={!ministry} type='time' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                                </div>
                                <div className="flex flex-col">
                                    <span className='text-slate-500 text-[0.8rem] font-semibold' >End Time <small className="text-[0.6rem]" >(The time this program often ends)</small> </span>
                                    <input onChange={handleChange} defaultValue={ministry?.endTime} name='endTime' required ={!ministry} type='time' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                                </div>
                            </div>

                        </div>


                        <div className="flex flex-col gap-5 flex-1">

                            <div className="flex flex-col">
                                <span className='text-slate-500 text-[0.8rem] font-semibold' >Description</span>
                                <textarea defaultValue={ministry?.description} onChange={handleChange} name='description'  className='rounded border px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                            </div>
                            
                            {
                                response?.message &&
                                <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
                            }
                            <div className="flex items-center gap-4">
                                <AddButton onClick={handleClose} text="Cancel" smallText noIcon className="rounded py-1" isCancel type="button" />
                                <AddButton disabled={loading} type='submit' text={loading ? 'loading...' : 'Update Class'} noIcon smallText className='rounded py-1 w-fit self-end' />
                            </div>
                        </div>
                    </div>

                </form>
            </div>   
        </div>
    </Modal>

  )
}

export default NewActivityDownV4