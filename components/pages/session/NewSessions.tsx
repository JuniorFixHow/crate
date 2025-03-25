'use client'
import AddButton from '@/components/features/AddButton'
import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import { ISession } from '@/lib/database/models/session.model'
import { ErrorProps } from '@/types/Types'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { minTime } from './fxn'
import { createSession } from '@/lib/actions/session.action'
import { Alert } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { canPerformAction, sessionRoles } from '@/components/auth/permission/permission'
import { useRouter } from 'next/navigation'

const NewSessions = () => {
  const [data, setData] = useState<Partial<ISession>>({});
  const [eventId, setEventId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorProps>(null);
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState<Date>(new Date());
  const formRef = useRef<HTMLFormElement>(null);
  const {user} = useAuth();

  const router = useRouter();

  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setData((prev)=>({
      ...prev,
      [name]:value,
    }))    
  }

  const sessionCreator = canPerformAction(user!, 'creator', {sessionRoles});

  useEffect(()=>{
    if(user && !sessionCreator){
      router.replace('/dashboard/forbidden?p=Session Creator')
    }
  },[user, sessionCreator, router])

  const handleNewSession = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setError(null);
    try {
      setLoading(true)
      const body:Partial<ISession> = {
        ...data,
        eventId,
        from:from.toISOString(),
        to:to.toISOString(),
        createdBy:user?.userId
      }
      const res = await createSession(body);
      console.log(res);
      setError({message:'Session created successfully', error:false});
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
      setError({message:'Error occured creating session.', error:true})
    }finally{
      setLoading(false);
    }
  }
  // console.log(data)
  if(!sessionCreator) return;

  return (
    <div   className='px-8 py-4 flex-col dark:bg-[#0F1214] dark:border flex gap-8 bg-white' >
        <span className='font-bold text-xl' >Add Session</span>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
          <form onSubmit={handleNewSession} ref={formRef}  className="flex flex-1 flex-col gap-5">
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Session Name</span>
                  <input required onChange={handleChange}  placeholder='eg. morning prayers...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
              </div>
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Venue</span>
                  <input required onChange={handleChange}  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="venue"  />
              </div>

              <div className="flex flex-row gap-12 items-center">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (From)</span>
                    <input  required onChange={(e)=>setFrom(new Date(e.target.value))} min={minTime(new Date())} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='datetime-local' name="from"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (To)</span>
                    <input  required onChange={(e)=>setTo(new Date(e.target.value))} min={minTime(from)} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='datetime-local' name="to"  />
                </div>
              </div>

              {/* <div className="flex flex-row gap-12 items-center">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Time (Start)</span>
                    <input min={minTime()} required onChange={handleChange} placeholder='00:00' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='time' name="startTime"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Time (End)</span>
                    <input min={minTime()} required onChange={handleChange} placeholder='00:00' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='time' name="endTime"  />
                </div>
              </div> */}

              
                {/* DONT FORGET TO HANDLE THE ONCHANGE EVENT OF THE DROPDOWN SELECT */}
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Event</span>
                  <SearchSelectEvents require={true} setSelect={setEventId}  className='w-fit' isGeneric />
              </div>

                {
                  error?.message &&
                  <Alert severity={error.error ? 'error':'success'} onClose={()=>setError(null)} >{error.message}</Alert>
                }
              <div className="flex gap-6 flex-row items-center">
                <AddButton disabled={loading} type='submit' text={loading ? 'loading...':'Create'} noIcon smallText className='rounded px-4' />
                <Link href='/dashboard/events/sessions' >
                  <AddButton text='Cancel' isCancel noIcon smallText className='rounded px-4' />
                </Link>
              </div>
          </form>


      {/* RIGHT */}
          
        </div>

    </div>
  )
}

export default NewSessions