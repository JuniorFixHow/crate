'use client'
import AddButton from '@/components/features/AddButton'
import { today } from '@/functions/dates'
import { useAuth } from '@/hooks/useAuth'
import { createEvent } from '@/lib/actions/event.action'
import { IEvent } from '@/lib/database/models/event.model'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'

const MainNewEvent = () => {
    const [data, setData] = useState<Partial<IEvent>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps>(null);

    const formRef = useRef<HTMLFormElement>(null);
    const {user} = useAuth();

    const router = useRouter();
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value,
            createdBy:user?.userId
        }));
    }

    const handleNewEvent = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            await createEvent(data);
            setError({message:'Event created successfully', error:false})
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured creating the event. Please, retry.', error:true})
        }finally{
            setLoading(false);
        }
    }

  return (
    <div className='page' >
      <form ref={formRef} onSubmit={handleNewEvent}   className='px-8 py-4 flex-col dark:bg-black dark:border flex gap-8 bg-white' >
            <span className='font-bold text-xl' >Add Event</span>
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
            <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Event Name</span>
                    <input required onChange={handleChange}  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Location</span>
                    <input required onChange={handleChange}  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="location"  />
                </div>

                <div className="flex flex-row gap-12 items-center">
                    <div className="flex flex-col gap-1">
                        <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (From)</span>
                        <input required onChange={handleChange} min={today()} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='date' name="from"  />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (To)</span>
                        <input required onChange={handleChange} min={today()} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='date' name="to"  />
                    </div>
                </div>

                <div className="flex flex-row gap-12">
                    <div className="flex flex-col gap-1">
                        <span className='text-slate-400 font-semibold text-[0.8rem]' >Children&apos;s price</span>
                        <input onChange={handleChange} min={0} defaultValue={0} placeholder='$' className='border-b w-36 p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='number' name="childPrice"  />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className='text-slate-400 font-semibold text-[0.8rem]' >Adults&apos; price</span>
                        <input required onChange={handleChange} min={0} defaultValue={0} placeholder='$' className='border-b w-36 p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='number' name="adultPrice"  />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Type</span>
                    <select required onChange={handleChange} name='type' defaultValue=''  className='border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none'  >
                        <option className='dark:bg-black' value="">select</option>
                        <option className='dark:bg-black' value="Convension">Convension</option>
                        <option className='dark:bg-black' value="Camp Meeting">Camp Meeting</option>
                        <option className='dark:bg-black' value="CYP">CYP</option>
                    </select>
                </div>

            </div>


        {/* RIGHT */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Description</span>
                    <textarea onChange={handleChange} placeholder='say something about this event' className='border rounded p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="note"  />
                </div>

                {
                    error?.message &&
                    <Alert onClose={()=>setError(null)}  severity={error.error ? 'error':'success'} >{error.message}</Alert>
                }
                
                <div className="flex gap-6 flex-row items-center">
                    <AddButton type='submit' text={loading? 'loading...':'Create'} noIcon smallText className='rounded px-4' />
                    <AddButton type='button' onClick={()=>router.push('/dashboard/events')} text='Cancel' isCancel noIcon smallText className='rounded px-4' />
                </div>
            </div>
            </div>

        </form>
    </div>
  )
}

export default MainNewEvent