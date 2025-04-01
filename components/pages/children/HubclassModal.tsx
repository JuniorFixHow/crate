import AddButton from '@/components/features/AddButton'
import  { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import { Modal } from '@mui/material';

import { useAuth } from '@/hooks/useAuth';

import { enqueueSnackbar } from 'notistack';
import SearchSelectEventsV5 from '@/components/features/SearchSelectEventsV5';

import { IEvent } from '@/lib/database/models/event.model';
import { IHubclass } from '@/lib/database/models/hubclass.model';
import { createHubclass, updateHubclass } from '@/lib/actions/hubclass.action';
import { useFetchHubClasses } from '@/hooks/fetch/useHubclass';

export type HubclassModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentClass:IHubclass|null,
    setCurrentClass:Dispatch<SetStateAction<IHubclass|null>>,
    updater?:boolean
}

const HubclassModal = ({infoMode, setInfoMode, updater, currentClass, setCurrentClass}:HubclassModalProps) => {
    const [data, setData] = useState<Partial<IHubclass>>({});
    const [eventId, setEventId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {user} = useAuth();
    const {refetch} = useFetchHubClasses();

    const event = currentClass?.eventId as IEvent;

    const mine = currentClass?.churchId.toString() === user?.churchId;

    const canUpdate = updater && mine;

    const formRef = useRef<HTMLFormElement>(null)
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleClose = ()=>{
        setCurrentClass(null);
        setInfoMode(false);
    }

    const handleNewHubclass = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const body:Partial<IHubclass> = {
                ...data,
                leaders:[],
                children:[], 
                eventId,
                churchId:user?.churchId
            }
            const res = await createHubclass(body);
            // setResponse({message:'Room created successfully', error:false});
            formRef.current?.reset();
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            setInfoMode(false);
            refetch();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating class', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateHubclass = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            if(currentClass){
                const body:Partial<IHubclass> = {
                    _id:currentClass?._id,
                    title:data.title || currentClass.title,
                    eventId: eventId||currentClass.eventId,
                }
                const res=  await updateHubclass(body);
                setCurrentClass(res?.payload as IHubclass);
                setInfoMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating class', {variant:'error'});
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
            <form onSubmit={ currentClass ? handleUpdateHubclass : handleNewHubclass} ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentClass ? "Edit Class":"Create Class"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Class Title</span>
                        <input onChange={handleChange} name='title' required={!currentClass} defaultValue={currentClass?.title} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Select Event</span>
                        <SearchSelectEventsV5 value={event?.name} setSelect={setEventId} require={!currentClass} />
                    </div>
                   
                </div>


                <div className="flex flex-row items-center gap-6">
                    <AddButton disabled={loading} type='submit'  className={`${currentClass && !canUpdate && 'hidden'} rounded w-[45%] justify-center`} text={loading ? 'loading...' : currentClass? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default HubclassModal