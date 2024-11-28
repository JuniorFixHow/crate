'use client'

import AddButton from '@/components/features/AddButton'
import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import Link from 'next/link'
import { minTime, timeToString } from './fxn'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ISession } from '@/lib/database/models/session.model'
import { getSession, updateSession } from '@/lib/actions/session.action'
import CircularIndeterminate from '@/components/misc/CircularProgress'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'

const EditSession = ({id}:{id:string}) => {
  const [data, setData] = useState<Partial<ISession>>({});
  const [eventId, setEventId] = useState<string>('');
  const [currentSession, setCurrentSession] = useState<ISession|null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [updateState, setUpdateState] = useState<ErrorProps>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [from, setFrom] =useState<Date|null>(null);
  const [to, setTo] =useState<Date|null>(null);
  const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setData((prev)=>({
      ...prev,
      [name]:value,
    }))
  }

  // console.log(data)
  useEffect(()=>{
    const fetchSession= async()=>{
      try {
        setLoading(true)
        if(id){
          const session:ISession = await getSession(id);
          setCurrentSession(session);
          setError(null);
        } 
      } catch (error) {
        console.log(error);
        setError('Error occured fetching session data')
      }finally{
        setLoading(false);
      }
    }
    fetchSession();
  },[id])

  // console.log(from?.toISOString(), to?.toISOString())

  const handleUpdateSession = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setUpdateState(null);
    try {
      setUpdateLoading(true);
      if(currentSession){
        const body:Partial<ISession> = {
          name:data.name || currentSession.name,
          venue:data.venue || currentSession.venue,
          from:from ? from.toISOString() :  currentSession?.from,
          to:to ? to.toISOString(): currentSession?.to,
          eventId:eventId||currentSession.eventId
        }
        console.log('body: ',body)
        const session:ISession =  await updateSession(currentSession._id, body);
        setCurrentSession(session);
        setUpdateState({message:'Session updated successfully', error:false});
      }
    } catch (error) {
      setUpdateState({message:'Error occured updating session', error:true});
      console.log(error);
    }finally{
      setUpdateLoading(false);
    }
  }

  // console.log('Date: ',new Date('2024-11-29T06:17'))
  // console.log('Session: ',currentSession)
  if(loading) return <CircularIndeterminate className={`${loading ? 'flex-center':'hidden'}`}  error={error} />

  return (
    <div   className='px-8 py-4 flex-col dark:bg-black dark:border flex gap-8 bg-white' >
        <span className='font-bold text-xl' >Edit Session</span>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
          <form onSubmit={handleUpdateSession}  className="flex flex-1 flex-col gap-5">
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Session Name</span>
                  <input onChange={handleChange} defaultValue={currentSession?.name} placeholder='eg. morning prayers...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
              </div>
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Venue</span>
                  <input onChange={handleChange} defaultValue={currentSession?.venue}  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="venue"  />
              </div>

              <div className="flex flex-row gap-12 items-center">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (From)</span>
                    <input defaultValue={currentSession?.from && timeToString(new Date(currentSession?.from))}  onChange={(e)=>setFrom(new Date(e.target.value))}  placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='datetime-local' name="from"  />
                </div>
                  
                  <div className="flex flex-col gap-1">
                      <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (To)</span>
                      <input defaultValue={currentSession?.to && timeToString(new Date(currentSession.to)) }  onChange={(e)=>setTo(new Date(e.target.value))} min={from ? minTime(from): minTime(new Date())} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='datetime-local' name="to"  />
                  </div>
              </div>

              {/* <div className="flex flex-row gap-12 items-center">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Time (Start)</span>
                    <input defaultValue={currentSession?.startTime} min={today()} placeholder='00:00' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='time' name="start"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Time (End)</span>
                    <input defaultValue={currentSession?.endTime} min={today()} placeholder='00:00' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='time' name="end"  />
                </div>
              </div> */}

              
                {/* DONT FORGET TO HANDLE THE ONCHANGE EVENT OF THE DROPDOWN SELECT */}
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Event</span>
                  <SearchSelectEvents setSelect={setEventId}  className='w-fit' isGeneric />
              </div>

              {
                updateState?.message &&
                <Alert onClose={()=>setUpdateState(null)} severity={updateState.error ? 'error':'success'} >{updateState.message}</Alert>
              }

              <div className="flex gap-6 flex-row items-center">
                <AddButton text={updateLoading ? 'loading...': 'Save Changes'} noIcon smallText className='rounded px-4' />
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

export default EditSession