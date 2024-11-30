import AddButton from '@/components/features/AddButton'
import { Alert, Modal } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import '../features/customscroll.css';
import SearchSelectEvents from '@/components/features/SearchSelectEvents';
import SearchSelectGroups from '@/components/features/SearchSelectGroups';
import { ErrorProps } from '@/types/Types';

type NewMemberProps = {
    open:boolean,
    eventId?:string,
    groupId?:string,
    setOpen:Dispatch<SetStateAction<boolean>>,
    setSelect?:Dispatch<SetStateAction<string>>,
    setSelectGroupId?:Dispatch<SetStateAction<string>>,
    showEvent:boolean,
    showGroup:boolean,
    setShowEvent:Dispatch<SetStateAction<boolean>>,
    setShowGroup:Dispatch<SetStateAction<boolean>>,
    loading:boolean,
    error:ErrorProps,
    handleGroup?:()=>Promise<void>,
    handleEvent?:()=>Promise<void>,
}

const RegisterForEvent = ({
    open, eventId, showEvent, showGroup, setOpen, setSelect,
    handleEvent, handleGroup, groupId, setShowEvent, setShowGroup, setSelectGroupId,
    error,  loading,
}:NewMemberProps) => {
    const handleClose=()=>{
        setOpen(false);
        setShowEvent(false);
        setShowGroup(false);
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
                {
                    showEvent &&
                    <>
                    <span className='text-[1.5rem] font-bold dark:text-slate-200' >Register member for an event</span>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select an Event</span>
                            <SearchSelectEvents setSelect={setSelect} isGeneric />
                        </div>
                        
                    </div>
                    </>
                }
                {
                    showGroup &&
                    <>
                    <span className='text-[1.5rem] font-bold dark:text-slate-200' >Member has been registered for the event. You can now pick a group for them</span>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select an Event</span>
                            <SearchSelectGroups eventId={eventId!} setSelect={setSelectGroupId} isGeneric />
                        </div>
                        
                    </div>
                    </>
                }
                {
                    error?.message &&
                    <Alert severity={error.error ? 'error':'success'} >{error.message}</Alert>
                }
                <div className="flex flex-row items-center justify-between">
                    {
                        showEvent && eventId &&
                        <AddButton disabled={loading} onClick={handleEvent}  className='rounded w-[45%] justify-center' text={loading ? 'registering...' : 'Proceed'} smallText noIcon />
                    }
                    {
                        showGroup && eventId && groupId &&
                        <AddButton disabled={loading} onClick={handleGroup}  className='rounded w-[45%] justify-center' text={loading ? 'adding...' : 'Add to group'} smallText noIcon />
                    }
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Do this later' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default RegisterForEvent