'use client'
import { canPerformAction, eventRoles } from '@/components/auth/permission/permission'
import AddButton from '@/components/features/AddButton'
import Address from '@/components/shared/Address'
import { today } from '@/functions/dates'
import { useAuth } from '@/hooks/useAuth'
import { createEvent } from '@/lib/actions/event.action'
import { IEvent } from '@/lib/database/models/event.model'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'


const MainNewEvent = () => {
  const [data, setData] = useState<Partial<IEvent>>({type:'Convention', organizers:'NAGACU'});
  const [location, setLocation] =useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorProps>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();
  const router = useRouter();

   const creator = canPerformAction(user!, 'creator', {eventRoles});
  
    useEffect(()=>{
        if(user && !creator){
            router.replace('/dashboard/forbidden?p=Activity Creator')
        }
    },[creator, user, router])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const body:Partial<IEvent> = {
        ...data,
        location,
        createdBy:user?.userId,
        churchId:user?.churchId,
      }
      const res = await createEvent(body);
      enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error occurred creating the event. Please, retry.", {variant:'error'});
    } finally {
      setLoading(false);
    }
  };

  // Handle custom questions
  if(!user) return;

  return (
    <div className="page">
      <form ref={formRef} onSubmit={handleNewEvent} className="px-3 md:px-8 py-4 flex-col dark:bg-[#0F1214] rounded dark:border flex gap-8 bg-white">
        <span className="font-bold text-xl">Add Event</span>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
          {/* LEFT */}
          <div className="flex flex-1 flex-col gap-5">
            {/* Existing Fields */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold text-[0.8rem]">Event Name</span>
              <input
                required
                onChange={handleChange}
                placeholder="type here..."
                className="border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                type="text"
                name="name"
              />
            </div>
            <div className="flex flex-col gap-1 pr-4 md:pr-0">
              <span className="text-slate-400 font-semibold text-[0.8rem]">Location</span>
              <Address setAddress={setLocation} required className='w-full md:w-fit' />
              {/* <input
                required
                onChange={handleChange}
                placeholder="type here..."
                className="border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                type="text"
                name="location"
              /> */}
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 md:items-center">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-semibold text-[0.8rem]">Date (From)</span>
                <input
                  required
                  onChange={handleChange}
                  min={today()}
                  placeholder="DD/MM/YYYY"
                  className="border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                  type="date"
                  name="from"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-semibold text-[0.8rem]">Date (To)</span>
                <input
                  required
                  onChange={handleChange}
                  min={today()}
                  placeholder="DD/MM/YYYY"
                  className="border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                  type="date"
                  name="to"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold text-[0.8rem]">Type</span>
              <select
                required
                onChange={handleChange}
                name="type"
                defaultValue="Convention"
                className="border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none"
              >
                <option className="dark:bg-black" value="Convention">Convention</option>
                <option className="dark:bg-black" value="Conference">Conference</option>
                <option className="dark:bg-black" value="Retreat">Retreat</option>
                <option className="dark:bg-black" value="Camp Meeting - Adult">Camp Meeting - Adult</option>
                <option className="dark:bg-black" value="Camp Meeting - YAYA">Camp Meeting - YAYA</option>
                <option className="dark:bg-black" value="Camp Meeting - Children">Camp Meeting - Children</option>
              </select>
            </div>

              <div className="flex flex-row gap-12 items-center">
                <div className="flex flex-col gap-1">
                  { 
                    data &&
                    ( data?.type !== 'Camp Meeting - Children' && data?.type !== 'Camp Meeting - YAYA')?
                    <span className="text-slate-400 font-semibold text-[0.8rem]">Price</span>
                    :
                    <span className="text-slate-400 font-semibold text-[0.8rem]">Adult&apos;s Price</span>
                  }
                  <input
                    
                    onChange={handleChange}
                    min={0}
                    placeholder="$"
                    className="border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                    type="number"
                    name="adultPrice"
                  />
                </div>
                {
                  data &&
                  (data?.type === 'Camp Meeting - Children' || data?.type === 'Camp Meeting - YAYA') &&
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-400 font-semibold text-[0.8rem]">Children&apos;s Price</span>
                      <input
                        onChange={handleChange}
                        min={0}
                        placeholder="$"
                        className="border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                        type="number"
                        name="childPrice"
                      />
                    </div>
                }
              </div>
          </div>
         
          <div className="flex flex-1 flex-col gap-5">

            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold text-[0.8rem]">Organizers</span>
              <select
                required
                onChange={handleChange}
                name="organizers"
                defaultValue="NAGACU"
                className="border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none"
              >
                <option className="dark:bg-black" value="NAGACU">
                  NAGACU
                </option>
                <option className="dark:bg-black" value="NAGSDA">
                  NAGSDA
                </option>
                <option className="dark:bg-black" value="Church">
                  Church
                </option>
                
              </select>
            </div>
             
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold text-[0.8rem]">Description</span>
              <textarea
                
                onChange={handleChange}
                placeholder="type here..."
                className="border p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                name="note"
              />
            </div>
          </div>
        </div>

          {error?.message && (
            <Alert onClose={() => setError(null)} severity={error.error ? "error" : "success"}>
              {error.message}
            </Alert>
          )}
        {/* Submit */}
        <div className="flex gap-6 flex-row items-center">
          <AddButton type="submit" text={loading ? "loading..." : "Create"} noIcon smallText className="rounded px-4" />
          <AddButton
            type="button"
            onClick={() => router.push("/dashboard/events")}
            text="Cancel"
            isCancel
            noIcon
            smallText
            className="rounded px-4"
          />
        </div>
      </form>
    </div>
  );
};

export default MainNewEvent;


