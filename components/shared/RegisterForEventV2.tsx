import AddButton from '@/components/features/AddButton'
import {  LinearProgress, Modal } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import '../features/customscroll.css';
// import SearchSelectEvents from '@/components/features/SearchSelectEvents';
// import SearchSelectGroups from '@/components/features/SearchSelectGroups';
import SearchSelectEventsV2 from '../features/SearchSelectEventsV2';
import { useFetchCYPSetForEvent } from '@/hooks/fetch/useCYPSet';
import { enqueueSnackbar } from 'notistack';
import { IRegistration } from '@/lib/database/models/registration.model';
import { createRegistration } from '@/lib/actions/registration.action';

type NewMemberProps = {
    open:boolean,
    eventId:string,
    memberId:string,
    setEventId:Dispatch<SetStateAction<string>>,
    setOpen:Dispatch<SetStateAction<boolean>>,
    setShowStart:Dispatch<SetStateAction<boolean>>,
}

const RegisterForEventV2 = ({
   eventId, setEventId, open, setOpen, memberId, setShowStart
}:NewMemberProps) => {

    const [pending, setPending] = useState<boolean>(false);
    const {cypsets, loading} = useFetchCYPSetForEvent(eventId);

    const handleClose=()=>{
        setOpen(false);
        setEventId('');
    }

    const handleEvent = async()=>{
        setPending(true);
        try {
            if(cypsets.length > 0  && cypsets.some((cypset) => cypset.sections?.length > 0)){
                setShowStart(true);
            }else{
                const data:Partial<IRegistration> = {
                    memberId:memberId,
                    eventId,
                    badgeIssued:'No',
                } 
                const res = await createRegistration(memberId, eventId, data);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured registering member', {variant:'error'});
        }finally{
            setPending(false);
        }
    }

    // console.log('Group Id: ',groupId);
  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <div className="new-modal scrollbar-custom overflow-y-scroll">
                    <span className='text-[1.5rem] font-bold dark:text-slate-200' >Register member for an event</span>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select an Event</span>
                            <SearchSelectEventsV2 setSelect={setEventId}  />
                        </div>
                    </div>
               {
                loading ? 
                <LinearProgress className='w-full' />
                :
                <div className="flex flex-row items-center justify-between">
                    {
                        eventId &&
                        <AddButton disabled={pending} onClick={handleEvent}  className='rounded w-[45%] justify-center' text={pending ? 'registering...' : 'Proceed'} smallText noIcon />
                    }
                    
                    <AddButton disabled={pending} className='rounded w-[45%] justify-center' text='Do this later' isCancel onClick={handleClose} smallText noIcon />
                </div>
               }
            </div>
        </div>
    </Modal>
  )
}

export default RegisterForEventV2