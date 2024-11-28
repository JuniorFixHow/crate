'use client'
import BottomActionItems from '@/components/features/BottomActionItems'
import Title from '@/components/features/Title'
import CircularIndeterminate from '@/components/misc/CircularProgress'
import { today } from '@/functions/dates'
import { getEvent, updateEvent } from '@/lib/actions/event.action'
import { IEvent } from '@/lib/database/models/event.model'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'

const EventMain = ({eventId}:{eventId:string}) => {
    const [event, setEvent] = useState<IEvent|null>(null);
    const [data, setData] = useState<Partial<IEvent>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState<string|null>(null);
    const [error, setError] = useState<ErrorProps>(null);

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {value, name} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value
        }))
    }

    useEffect(()=>{
        const fetchEvent = async()=>{
            try {
                if(eventId){
                    const event:IEvent = await getEvent(eventId);
                    setEvent(event);
                    setLoadingError(null);
                }
                
            } catch (error) {
                console.log(error);
                setLoadingError('Error occured fetching event');
            }finally{
                setLoading(false);
            }
        }
        fetchEvent();
    },[eventId])


    const handleUpdateEvent = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null)
        try {
            setUpdateLoading(true)
          if(event){
            const body:Partial<IEvent> = {
              name:data.name||event.name,
              location:data.location||event.location,
              from:data.from||event.from,
              to:data.to||event.to,
              note:data.note||event.note,
              type:data.type||event.type,
              childPrice:data.childPrice||event.childPrice,
              adultPrice:data.adultPrice||event.adultPrice,
            }
            const evt = await updateEvent(event._id, body);
            setEvent(event);
            setError({message:'Event updated successfully', error:false});
  
          }
        } catch (error) {
          console.log(error);
          setError({message:'Error occured updating the event', error:true});
        }finally{
          setUpdateLoading(false);
        }
      }


    if(loading) return <CircularIndeterminate className={`${loading ? 'flex-center':'hidden'}`}  error={loadingError} />

  return (
    <div className='page' >
        <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
            <div className="flex flex-row items-baseline gap-2">
                <Title clickable link='/dashboard/events' text='Events' />
                <IoIosArrowForward/>
                <Title text='Event Details' />
            </div>
    
            <form onSubmit={handleUpdateEvent}   className='px-8 py-4 flex-col dark:bg-black dark:border flex gap-8 bg-white' >
                {/* <span className='font-bold text-xl' >Add Event</span> */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
                <div className="flex flex-1 flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <span className='text-slate-400 font-semibold text-[0.8rem]' >Event Name</span>
                        <input onChange={handleChange} defaultValue={event?.name}  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className='text-slate-400 font-semibold text-[0.8rem]' >Location</span>
                        <input onChange={handleChange} defaultValue={event?.location}  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="location"  />
                    </div>

                    <div className="flex flex-row gap-12 items-center">
                        <div className="flex flex-col gap-1">
                            <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (From)</span>
                            <input onChange={handleChange} min={today()} defaultValue={event?.from} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='date' name="from"  />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (To)</span>
                            <input onChange={handleChange} min={today()} defaultValue={event?.to} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='date' name="to"  />
                        </div>
                    </div>

                    <div className="flex flex-row gap-12">
                        <div className="flex flex-col gap-1">
                            <span className='text-slate-400 font-semibold text-[0.8rem]' >Children&apos;s price</span>
                            <input onChange={handleChange} min={0} defaultValue={event?.childPrice} placeholder='$' className='border-b w-36 p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='number' name="childPrice"  />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className='text-slate-400 font-semibold text-[0.8rem]' >Adults&apos; price</span>
                            <input onChange={handleChange} min={0} defaultValue={event?.adultPrice} placeholder='$' className='border-b w-36 p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='number' name="adultPrice"  />
                        </div>
                    </div>

                    {/* adult price {event?.adultPrice} */}

                    <div className="flex flex-col gap-1">
                        <span className='text-slate-400 font-semibold text-[0.8rem]' >Type</span>
                        <select onChange={handleChange} name='type' defaultValue={event?.type}  className='border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none'  >
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
                        <textarea onChange={handleChange} defaultValue={event?.note} placeholder='say something about this event' className='border rounded p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="note"  />
                    </div>

                        {
                            error?.message &&
                            <Alert onClose={()=>setError(null)} severity={error.error ? 'error':'success'} >{error.message}</Alert>
                        }
                        <BottomActionItems updateLoading={updateLoading} setError={setError} event={event!} />
                </div>
                </div>

            </form>
        </div>
    </div>
  )
}

export default EventMain