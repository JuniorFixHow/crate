import AddButton from '@/components/features/AddButton'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { RevenueInfoModalProps } from './RevenueInfoModal';
import { Alert, Modal } from '@mui/material';
import SearchSelectEvents from '@/components/features/SearchSelectEvents';
import { ErrorProps } from '@/types/Types';
import { IPayment } from '@/lib/database/models/payment.model';
import { createPayment, updatePayment } from '@/lib/actions/payment.action';
import SearchSelectRegistrationByEvent from '@/components/features/SearchSelectRegistrationByEvent';
import { useAuth } from '@/hooks/useAuth';

const NewRevenue = ({infoMode, setInfoMode, currentRevenue, setCurrentRevenue}:RevenueInfoModalProps) => {
    const [data, setData] = useState<Partial<IPayment>>({});
    const [payer, setPayer] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const {user} = useAuth()

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
                payee:user?.userId, payer
            }
            const res = await createPayment(body);
            setResponse(res);
            formRef.current?.reset();
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
                    payer:data.payer || currentRevenue.payer,
                    amount:data.amount || currentRevenue.amount,
                    purpose:data.purpose || currentRevenue.purpose,
                    narration:data.narration || currentRevenue.narration,
                }
                const res=  await updatePayment(currentRevenue._id, body);
                const result = res?.payload as IPayment
                setCurrentRevenue(result);
                setResponse(res);
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

                    <div className="flex gap-12 items-end">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Event</span>
                            <SearchSelectEvents setSelect={setEventId} require={!currentRevenue} isGeneric />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Member</span>
                            <SearchSelectRegistrationByEvent require={!currentRevenue} setSelect={setPayer} eventId={eventId} isGeneric />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Amount ($)</span>
                        <input onChange={handleChange} name='amount' min={0} step={0.01} required={!currentRevenue} defaultValue={currentRevenue?.amount} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

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