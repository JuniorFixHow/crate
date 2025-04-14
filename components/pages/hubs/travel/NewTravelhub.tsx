import AddButton from '@/components/features/AddButton'
import  { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import { Modal } from '@mui/material';

import { useAuth } from '@/hooks/useAuth';

import { enqueueSnackbar } from 'notistack';

import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import '@/components/features/customscroll.css'
import { ITravelhub } from '@/lib/database/models/travelhub.model';
import { createTravelHub, updateTravelHub } from '@/lib/actions/travel.action';
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2';
import SearchSelectRegistrationByEventV2 from '@/components/features/SearchSelectRegistrationByEventV2';
import CustomCheck from '../../group/new/CustomCheck';
import { timeToString } from '../../session/fxn';
import { IEvent } from '@/lib/database/models/event.model';
import { getTodayDate } from '@/functions/dates';
import { IRegistration } from '@/lib/database/models/registration.model';
import { IMember } from '@/lib/database/models/member.model';


export type NewTravelhubProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentHub:ITravelhub|null,
    setCurrentHub:Dispatch<SetStateAction<ITravelhub|null>>,
    updater?:boolean,
    evId?:string,
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ITravelhub[], Error>>
}

const NewTravelhub = ({infoMode, setInfoMode, evId, refetch, updater, currentHub, setCurrentHub}:NewTravelhubProps) => {
    const [data, setData] = useState<Partial<ITravelhub>>({});
    const [dates, setDates] = useState<Partial<ITravelhub>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [pickup, setPickup] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    const [regId, setRegId] = useState<string>('');
    const {user} = useAuth();


    const mine = currentHub?.churchId.toString() === user?.churchId;

    const canUpdate = updater && mine;
    const event = currentHub?.eventId as IEvent;
    const reg = currentHub?.regId as IRegistration;
    const member = reg?.memberId as IMember;

    const formRef = useRef<HTMLFormElement>(null)
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleChangeDate = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setDates((prev)=>({
            ...prev,
            [name]:timeToString(new Date(value))
        }))
    }

    useEffect(()=>{
        if(currentHub){
            setPickup(currentHub?.pickup)
        }
    },[currentHub])
    const handleClose = ()=>{
        setCurrentHub(null);
        setInfoMode(false);
    }

    const handleNewHub = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const body:Partial<ITravelhub> = {
                ...data,
                ...dates,
                eventId:evId || eventId,
                regId,
                pickup,
                createdBy:user?.userId,
                churchId:user?.churchId
            }
            const res = await createTravelHub(body);
            // setResponse({message:'Room created successfully', error:false});
            formRef.current?.reset();
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            setInfoMode(false);
            refetch();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating travel item', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateHub = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            if(currentHub){
                const body:Partial<ITravelhub> = {
                    _id:currentHub?._id,
                    depAirport:data.depAirport || currentHub.depAirport,
                    arrAirport:data.arrAirport || currentHub.arrAirport,
                    arrTerminal:data.arrTerminal || currentHub.arrTerminal,
                    notes:data.notes || currentHub.notes,
                    pickup,
                    eventId:evId || eventId || event?._id,
                    depTime:dates.depTime || currentHub.depTime,
                    arrTime:dates.arrTime || currentHub.arrTime,
                }
                const res=  await updateTravelHub(body);
                // setCurrentClass(res?.payload as IHubclass);
                setInfoMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating travel item', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }

  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <form onSubmit={ currentHub ? handleUpdateHub : handleNewHub} ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentHub ? "Edit":"Create"}</span>
                <div className="flex flex-col gap-6">
                    {
                        !evId &&
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Event</span>
                            <SearchSelectEventsV2 value={event?.name} require={!currentHub} setSelect={setEventId} width={300} />
                        </div>
                    }
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Select Member</span>
                        <SearchSelectRegistrationByEventV2 value={member?.name} setSelect={setRegId} require={!currentHub} eventId={evId || eventId} />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Departure Airport</span>
                        <input onChange={handleChange} name='depAirport' required={!currentHub} defaultValue={currentHub?.depAirport} type='text' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Arrival Airport</span>
                        <input onChange={handleChange} name='arrAirport' required={!currentHub} defaultValue={currentHub?.arrAirport} type='text' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row md:gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Departure Time</span>
                            <input min={!currentHub ? getTodayDate():''} onChange={handleChangeDate} name='depTime' required={!currentHub} defaultValue={currentHub?.depTime} type='datetime-local' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Arrival Time</span>
                            <input min={dates.depTime} onChange={handleChangeDate} name='arrTime' required={!currentHub} defaultValue={currentHub?.arrTime} type='datetime-local' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Arrival Terminal</span>
                        <input onChange={handleChange} name='arrTerminal' required={!currentHub} defaultValue={currentHub?.arrTerminal} type='text' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    <div className="flex gap-4 items-center">
                        <span className='text-slate-500 text-[0.8rem]' >Requires pick-up at the airport</span>
                        <CustomCheck checked={pickup} onClick={()=>setPickup(pre=>!pre)} />
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Note</span>
                        <textarea onChange={handleChange} name='notes'  defaultValue={currentHub?.notes} className='border px-[0.3rem] rounded dark:bg-transparent dark:text-slate-300 py-1 border-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                </div>

                <div className="flex flex-row items-center gap-6">
                    <AddButton disabled={loading} type='submit'  className={`${currentHub && !canUpdate && 'hidden'} rounded w-[45%] justify-center`} text={loading ? 'loading...' : currentHub? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewTravelhub