'use client'
import AddButton from '@/components/features/AddButton'
// import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import { ErrorProps } from '@/types/Types'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
// import { createSession } from '@/lib/actions/session.action'
import { Alert, Tooltip } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { minTime } from '../../session/fxn'
import SearchSelectClassministries from '@/components/features/SearchSelectClassministries'
import SearchSelectActivity from '@/components/features/SearchSelectActivity'
import SearchSelectClassV2 from '@/components/features/SearchSelectClassV2'
import { IClasssession } from '@/lib/database/models/classsession.model'
import { createCSession } from '@/lib/actions/classsession.action'
import { enqueueSnackbar } from 'notistack'

import { useQuery } from '@tanstack/react-query'
import { IActivity } from '@/lib/database/models/activity.model'
import { getActivity } from '@/lib/actions/activity.action'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import { canPerformAction, classSessionRoles } from '@/components/auth/permission/permission'

const NewSessionsV2 = () => {
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
  const {user} = useAuth();
  const router = useRouter();

  const creator = canPerformAction(user!, 'creator', {classSessionRoles});

  useEffect(()=>{
    if(user && (!creator)){
      router.replace('/dashboard/forbidden?p=Session Creator')
    }
  },[creator, user, router])

  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setData((prev)=>({
      ...prev,
      [name]:value,
    }))    
  }

  const fetchActivity = async():Promise<IActivity|null>=>{
    try {
      const response = await getActivity(activityId) as IActivity;
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  const {data:activity} = useQuery({
    queryKey:['act', activityId],
    queryFn:fetchActivity,
    enabled:!!activityId
  })

  const handleNewSession = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setError(null);
    try {
      setLoading(true)
      const body:Partial<IClasssession> = {
        ...data,
        classId:ministryId,
        from:from.toISOString(),
        to:to.toISOString(),
        createdBy:user?.userId
      }
      const res = await createCSession(body);
      console.log(res);
      enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
      formRef.current?.reset();
      router.push('/dashboard/ministries/sessions');
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error occured creating session.', {variant:'error'});
    }finally{
      setLoading(false);
    }
  }
  // console.log(data)
  if(!creator) return;

  return (
    <div className="flex flex-col gap-6">
      {
        activity &&
        <Alert severity='warning' variant='standard' >{`The '${activity?.name}' activity is set to reoccur ${activity?.frequency}. Therefore sessions will be created in due time automatically. However, you may also want to bypass the frequency and create your own session.`}</Alert>
      }
      <div   className='px-8 py-4 flex-col dark:bg-[#0F1214] dark:border flex gap-8 bg-white' >
          <span className='font-bold text-xl' >Add Session</span>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
            <form onSubmit={handleNewSession} ref={formRef}  className="flex flex-1 flex-col gap-5">
                  <div className="flex flex-col">
                      <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Ministry</span>
                      <SearchSelectClassministries width={250} require setSelect={setClassMinistryId} />
                  </div>
                  {
                      classMinistryId && 
                      <div className="flex flex-col">
                          <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Activity</span>
                          <SearchSelectActivity width={250} require minId={classMinistryId} setSelect={setActivityId} />
                      </div>
                  }
                  {
                      activityId && 
                      <div className="flex flex-col">
                          <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Class</span>
                          <SearchSelectClassV2 width={250} require activityId={activityId} setSelect={setMinistryId} />
                      </div>
                  }
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Session Name</span>
                    <input required onChange={handleChange}  placeholder='eg. morning prayers...' className='border-b p-1 outline-none w-[85%] md:w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                      <span className='text-slate-400 font-semibold text-[0.8rem]' >Venue</span>
                      <Tooltip title='The venue of the session other the local church of the ministry. This is optional' ><IoMdInformationCircleOutline /></Tooltip>
                    </div>
                    <input onChange={handleChange}  placeholder='type here...' className='border-b p-1 outline-none w-[85%] md:w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="venue"  />
                </div>

                <div className="flex flex-col gap-5 md:flex-row md:gap-12 md:items-center">
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

export default NewSessionsV2