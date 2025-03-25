'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import AddButton from './AddButton'
import DeleteDialog from '@/components/DeleteDialog';
import { IEvent } from '@/lib/database/models/event.model';
import { ErrorProps } from '@/types/Types';
import { deleteEvent, } from '@/lib/actions/event.action';
import { useRouter } from 'next/navigation';

type BottomActionItemsProps = {
  event: IEvent,
  updateLoading:boolean,
  setError:Dispatch<SetStateAction<ErrorProps>>;
  deleter:boolean;
  updater:boolean;
}

const BottomActionItems = ({event, deleter, updater, setError, updateLoading}:BottomActionItemsProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleDelete = async()=>{
      try {
        await deleteEvent(event._id);
        router.push('/dashboard/events');
        setError({message:'Event deleted successfully.', error:false});
      } catch (error) {
        console.log(error)
        setError({message:'Error occured deleting the event.', error:true});
      }finally{
        setLoading(false);
      }
    }
  
    const message = 'Hmmm, this is critical. Deleting an event will delete all sessions, attendance and event registration records associated with it.\nIt is recommended to delete the items that are no longer required instead of deleting the entire event. Have you thought this through?'
  return (
    <div className="flex gap-6 flex-row items-center">
        
        <DeleteDialog onTap={handleDelete} message={message} title={`Delete event '${event.name}'?`} value={open} setValue={setOpen} />
        {
          updater &&
          <AddButton disabled={updateLoading} type='submit' text={updateLoading ? 'loading...' :'Save Changes'} noIcon smallText className='rounded px-4' />
        }
        {
          deleter &&
          <AddButton disabled={loading} type='button' onClick={()=>setOpen(true)} text='Delete' isDanger noIcon smallText className='rounded px-4' />
        }
  </div>
  )
}

export default BottomActionItems