import AddButton from '@/components/features/AddButton'
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { RevenueInfoModalProps } from './RevenueInfoModal';
import { Alert, Modal } from '@mui/material';
import { ErrorProps } from '@/types/Types';
import { IPayment } from '@/lib/database/models/payment.model';
import { createPayment, getChurchExpectedRevenue, updatePayment } from '@/lib/actions/payment.action';
// import SearchSelectRegistrationByEvent from '@/components/features/SearchSelectRegistrationByEvent';
import { useAuth } from '@/hooks/useAuth';
import { useFetchRevenues } from '@/hooks/fetch/useRevenue';
import { enqueueSnackbar } from 'notistack';
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2';
import { IEvent } from '@/lib/database/models/event.model';
// import SearchSelectMembers from '@/components/features/SearchSelectMembers';
import SearchSelectChurchesV2 from '@/components/features/SearchSelectChurchesV2';
import { IChurch } from '@/lib/database/models/church.model';
import { IRegistration } from '@/lib/database/models/registration.model';
import { IMember } from '@/lib/database/models/member.model';
import SearchSelectRegistrationByEventV2 from '@/components/features/SearchSelectRegistrationByEventV2';
import { useQuery } from '@tanstack/react-query';

type PayType = 'Member'|'Church'

const NewRevenue = ({infoMode, setInfoMode, currentRevenue, setCurrentRevenue}:RevenueInfoModalProps) => {
    const [data, setData] = useState<Partial<IPayment>>({});
    const [payer, setPayer] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const [mchurchId, setMChurchId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [payType, setPayType] = useState<PayType>('Member');
    const [due, setDue] = useState<number>(0);

    const {user} = useAuth();
    const {refetch} = useFetchRevenues();

    const event = currentRevenue?.eventId as IEvent;
    const church = currentRevenue?.churchId as IChurch;
    const reg = currentRevenue?.payer as IRegistration;
    const member = reg?.memberId as IMember;

    
    const fetchRevenue = async():Promise<number>=>{
        try {
            if(!eventId || !churchId) return 0;
            const income = await getChurchExpectedRevenue(eventId, churchId) as number;
            return income;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    const {data:income=0, isPending} = useQuery({
        queryKey:['revenuebychurch', eventId, churchId],
        queryFn:fetchRevenue,
        enabled: !!eventId && !!churchId
    })
    
    
    useEffect(()=>{
        if(income > 0 && data.amount){
            setDue(income - data.amount)
        }
    },[data.amount, income])

    useEffect(()=>{
        if(currentRevenue){
            if(currentRevenue?.payer){
                setPayType('Member')
            }else if(currentRevenue?.churchId)
            {
                setPayType('Church');
            }
        }
    },[currentRevenue])

    const formRef = useRef<HTMLFormElement>(null)
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }



    const handleClose = ()=>{
        setCurrentRevenue(null);
        setInfoMode(false);
    }

    const handleNewRevenue = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const body:Partial<IPayment> = {
                ...data, 
                payee:user?.userId, payer:payer || null, 
                churchId:payType === 'Member' ? mchurchId : churchId, 
                eventId
            }
            const res = await createPayment(body);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            formRef.current?.reset();
            setInfoMode(false);
            refetch();
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured creating room', error:true})
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateRevenue = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            if(currentRevenue){
                const body:Partial<IPayment> = {
                    payer:data.payer || currentRevenue.payer || null,
                    amount:data.amount || currentRevenue.amount,
                    eventId:eventId || currentRevenue.eventId,
                    churchId:churchId || currentRevenue.churchId,
                    purpose:data.purpose || currentRevenue.purpose,
                    narration:data.narration || currentRevenue.narration,
                }
                const res=  await updatePayment(currentRevenue._id, body);
                // const result = res?.payload as IPayment
                // setCurrentRevenue(result);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
                setInfoMode(false);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured updating room', error:true})
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
            <form onSubmit={currentRevenue ? handleUpdateRevenue:handleNewRevenue}  ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentRevenue ? "Edit Payment":"Make Payment"}</span>
                <div className="flex flex-col gap-6">

                    <div className="flex flex-col w-[15.5rem]">
                        <span className='text-slate-500 text-[0.8rem]' >Pay For</span>
                        <select onChange={(e)=>setPayType(e.target.value as PayType)} required={!currentRevenue}  className='border rounded px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={payType} >
                            <option className='dark:bg-black dark:text-white' value="Member">Member</option>
                            <option className='dark:bg-black dark:text-white' value="Church">Church</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:gap-12 items-end md:flex-row gap-6">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Event</span>
                            <SearchSelectEventsV2  setSelect={setEventId} require={!currentRevenue} value={event?.name} />
                        </div>
                        
                        {
                            payType === 'Member' ?
                            <div className="flex flex-col">
                                <span className='text-slate-500 text-[0.8rem]' >Select Member</span>
                                <SearchSelectRegistrationByEventV2 setSelectChurchId={setMChurchId} eventId={eventId} require={!currentRevenue} setSelect={setPayer} value={member?.name}  />
                            </div>
                            :
                            <div className="flex flex-col">
                                <span className='text-slate-500 text-[0.8rem]' >Select Church</span>
                                <SearchSelectChurchesV2 require={!currentRevenue} value={church?.name} setSelect={setChurchId}  />
                            </div>
                        }
                    </div>



                    <div className="flex flex-col w-[15.5rem]">
                        <span className='text-slate-500 text-[0.8rem]' >Amount ($)</span>
                        <input onChange={handleChange} name='amount' min={0} step={0.01} required={!currentRevenue} defaultValue={currentRevenue?.amount} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    {
                        payType === 'Church' &&
                        <div className="flex flex-col gap-6 md:flex-row md:gap-12">
                            <div className="flex flex-col w-[15.5rem]">
                                <span className='text-slate-500 text-[0.8rem]' >Expected Payment ($)</span>
                                <input readOnly value={income} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder={isPending? 'calculating...':'0'} />
                            </div>
                            {
                                data?.amount &&
                                <div className="flex flex-col w-[15.5rem]">
                                    <span className='text-slate-500 text-[0.8rem]' >Amount Due ($)</span>
                                    <input readOnly value={due} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='' />
                                </div>
                            }
                        </div>
                    }
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Purpose</span>
                        <select onChange={handleChange} required={!currentRevenue}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRevenue?.purpose} name="purpose">
                            <option className='dark:bg-black dark:text-white' value="">select</option>
                            <option className='dark:bg-black dark:text-white' value="Camp Fee - Adults">Camp Fee - Adults</option>
                            <option className='dark:bg-black dark:text-white' value="Camp Fee - YaYa">Camp Fee - YaYa</option>
                        </select>
                    </div>
                    

                    

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Narration</span>
                        <textarea onChange={handleChange} name='narration' defaultValue={currentRevenue?.narration}  className='border rounded px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    
                </div>

                {
                    response?.message &&
                    <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
                }

                <div className="flex flex-row items-center gap-6">
                    <AddButton disabled={loading} type='submit'  className='rounded w-[45%] justify-center' text={loading ? 'loading...' : currentRevenue? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewRevenue