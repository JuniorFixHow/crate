'use client'
import React, { useState } from 'react'
import AddButton from './AddButton'
import DeleteDialog from '@/components/DeleteDialog';
import { EventProps } from '@/types/Types';
import { Alert } from '@mui/material';
import CheckIcon  from '@mui/icons-material/Check'

const BottomActionItems = ({event}:{event: EventProps}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [deleted, setDeleted] = useState<boolean>(false);
    const handleDelete = ()=>{
        setDeleted(true);
    }
    const message = 'Note: Deleting an event will delete all sessions and attendance records associated with it.\nIt is recommended to delete the sessions or attendance records that are no longer required instead of deleting the entire event.'
  return (
    <div className="flex gap-6 flex-row items-center">
        {
            deleted &&
            <Alert className='absoulte top-0' onClose={()=>setDeleted(false)} icon={<CheckIcon fontSize='inherit' />} severity='success' >Event deleted successfully</Alert>
        }
        <DeleteDialog onTap={handleDelete} message={message} title={`Delete event '${event.name}'?`} value={open} setValue={setOpen} />
        <AddButton text='Save Changes' noIcon smallText className='rounded px-4' />
        <AddButton onClick={()=>setOpen(true)} text='Delete' isDanger noIcon smallText className='rounded px-4' />
  </div>
  )
}

export default BottomActionItems