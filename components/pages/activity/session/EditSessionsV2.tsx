'use client'
import AddButton from '@/components/features/AddButton'
// import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import { ErrorProps } from '@/types/Types'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
// import { createSession } from '@/lib/actions/session.action'
import { Alert, Tooltip } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { minTime, timeToString } from '../../session/fxn'
import SearchSelectClassministries from '@/components/features/SearchSelectClassministries'
import SearchSelectActivity from '@/components/features/SearchSelectActivity'
import SearchSelectClassV2 from '@/components/features/SearchSelectClassV2'
import { IClasssession } from '@/lib/database/models/classsession.model'
import {  updateCSession } from '@/lib/actions/classsession.action'
import { enqueueSnackbar } from 'notistack'
import { IoMdInformationCircleOutline } from 'react-icons/io'


type EditSessionsV2Props = {
    currentSession:IClasssession
}


const EditSessionsV2 = ({currentSession}:EditSessionsV2Props) => {
  const [data, setData] = useState<Partial<IClasssession>>({});
  // const [eventId, setEventId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorProps>(null);
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState<Date>(new Date());
  const [classMinistryId, setClassMinistryId] = useState<string>('');
  const [activityId, setActivityId] = useState<string>('');
  const [ministryId, setMinistryId] = useState<string>('');

  const formRef = useRef<HTMLFormElement>(null);
  const {user} = useAuth()
  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setData((prev)=>({
      ...prev,
      [name]:value,
    }))    
  }

  

  const handleUpdateSession = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setError(null);
    try {
      setLoading(true)
      const body:Partial<IClasssession> = {
        name:data.name || currentSession?.name,
        venue:data.venue || currentSession?.venue,
        from:from ? from.toISOString() :  currentSession?.from,
        to:to ? to.toISOString(): currentSession?.to,
        classId:ministryId ?? currentSession?.classId,
        createdBy:user?.userId
      }
      const res = await updateCSession(currentSession?._id, body);
      console.log(res);
      enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error occured creating session.', {variant:'error'});
    }finally{
      setLoading(false);
    }
  }
  // console.log(data)

  return (
    <div className="flex flex-col gap-6">
      
      <div   className='px-8 py-4 flex-col dark:bg-[#0F1214] dark:border flex gap-8 bg-white' >
          <span className='font-bold text-xl' >Edit Session</span>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
            <form onSubmit={handleUpdateSession} ref={formRef}  className="flex flex-1 flex-col gap-5">
                  <div className="flex flex-col">
                      <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Ministry</span>
                      <SearchSelectClassministries width={300} setSelect={setClassMinistryId} />
                  </div>
                  {
                      classMinistryId && 
                      <div className="flex flex-col">
                          <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Activity</span>
                          <SearchSelectActivity width={300} minId={classMinistryId} setSelect={setActivityId} />
                      </div>
                  }
                  {
                      activityId && 
                      <div className="flex flex-col">
                          <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Class</span>
                          <SearchSelectClassV2 width={300}  activityId={activityId} setSelect={setMinistryId} />
                      </div>
                  }
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Session Name</span>
                    <input onChange={handleChange} defaultValue={currentSession?.name}  placeholder='eg. morning prayers...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                      <span className='text-slate-400 font-semibold text-[0.8rem]' >Venue</span>
                      <Tooltip title='The venue of the session other the local church of the ministry. This is optional' ><IoMdInformationCircleOutline /></Tooltip>
                    </div>
                    <input onChange={handleChange} defaultValue={currentSession?.venue} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="venue"  />
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
                      <input min={minTime()} required onChange={handleChange} placeholder='00:00' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='time' name="startTime"  />
                  </div>
                  <div className="flex flex-col gap-1">
                      <span className='text-slate-400 font-semibold text-[0.8rem]' >Time (End)</span>
                      <input min={minTime()} required onChange={handleChange} placeholder='00:00' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='time' name="endTime"  />
                  </div>
                </div> */}

                
                  {/* DONT FORGET TO HANDLE THE ONCHANGE EVENT OF THE DROPDOWN SELECT */}
                {/* <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Event</span>
                    <SearchSelectEvents require={true} setSelect={setEventId}  className='w-fit' isGeneric />
                </div> */}

                  {
                    error?.message &&
                    <Alert severity={error.error ? 'error':'success'} onClose={()=>setError(null)} >{error.message}</Alert>
                  }
                <div className="flex gap-6 flex-row items-center">
                  <AddButton disabled={loading} type='submit' text={loading ? 'loading...':'Create'} noIcon smallText className='rounded px-4' />
                  <Link href='/dashboard/ministries/sessions' >
                    <AddButton text='Cancel' isCancel noIcon smallText className='rounded px-4' />
                  </Link>
                </div>
            </form>


        {/* RIGHT */}
            
          </div>

      </div>
    </div>
  )
}

export default EditSessionsV2