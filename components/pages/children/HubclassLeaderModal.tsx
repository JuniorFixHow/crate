import AddButton from '@/components/features/AddButton'
import  { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import { Modal } from '@mui/material';

import { useAuth } from '@/hooks/useAuth';

import { enqueueSnackbar } from 'notistack';

import { IEvent } from '@/lib/database/models/event.model';
import { IHubclass } from '@/lib/database/models/hubclass.model';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { IChildrenrole } from '@/lib/database/models/childrenrole.model';
import { createChildrenrole, updateChildrenrole } from '@/lib/actions/childrenrole.action';
import SearchSelectRegistrationByEventV3 from '@/components/features/SearchSelectRegistrationByEventV3';
import { IMember } from '@/lib/database/models/member.model';

export type HubclassLeaderModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentRole:IChildrenrole|null,
    setCurrentRole:Dispatch<SetStateAction<IChildrenrole|null>>,
    updater?:boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IChildrenrole[], Error>>;
    hubClass:IHubclass;
}

const HubclassLeaderModal = ({infoMode, hubClass, refetch, setInfoMode, updater, currentRole, setCurrentRole}:HubclassLeaderModalProps) => {
    const [data, setData] = useState<Partial<IChildrenrole>>({});
    const [memberId, setMemberId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {user} = useAuth();


    const newEvent = hubClass?.eventId as IEvent;

    const mine = currentRole?.churchId.toString() === user?.churchId;
    const currentMember = currentRole?.memberId as IMember;

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
        setCurrentRole(null);
        setInfoMode(false);
    }

    const handleNewHubRole = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const body:Partial<IChildrenrole> = {
                ...data,
                memberId,
                classId:hubClass?._id,
                eventId:newEvent?._id,
                churchId:user?.churchId
            }
            const res = await createChildrenrole(body);
            // setResponse({message:'Room created successfully', error:false});
            formRef.current?.reset();
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            setInfoMode(false);
            refetch();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating role', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateHubRole = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            if(currentRole){
                const body:Partial<IChildrenrole> = {
                    _id:currentRole?._id,
                    title:data.title || currentRole.title,
                }
                const res=  await updateChildrenrole(body);
                // setCurrentRole(res?.payload as IHubclass);
                setInfoMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating role', {variant:'error'});
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
            <form onSubmit={ currentRole ? handleUpdateHubRole : handleNewHubRole} ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <div className="flex flex-col gap-4 md:flex-row md:gap-3 md:items-center">
                    <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentRole ? "Edit Role":"Create Role"}</span>
                    <span className='hidden md:block' >-</span>
                    <span className='text-[1rem] font-semibold dark:text-slate-200' >{hubClass?.title}</span>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Role Title</span>
                        <input onChange={handleChange} name='title' required={!currentRole} defaultValue={currentRole?.title} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Select Member</span>
                        <SearchSelectRegistrationByEventV3 value={currentMember?.name} eventId={newEvent?._id}  setSelectMemberId={setMemberId} require={!currentRole} />
                    </div>
                   
                </div>


                <div className="flex flex-row items-center gap-6">
                    <AddButton disabled={loading} type='submit'  className={`${currentRole && !canUpdate && 'hidden'} rounded w-[45%] justify-center`} text={loading ? 'loading...' : currentRole? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default HubclassLeaderModal