import AddButton from '@/components/features/AddButton'
import  {  Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import { Alert, Modal } from '@mui/material';
import { ErrorProps } from '@/types/Types';
import { useAuth } from '@/hooks/useAuth';

import { IMinistryrole } from '@/lib/database/models/ministryrole.model';
import SearchSelectMembers from '@/components/features/SearchSelectMembers';
import { createMinistryrole, updateMinistryrole } from '@/lib/actions/ministryrole.action';
import { useFetchMinistryroleforMinistry } from '@/hooks/fetch/useMinistryrole';
import { IMember } from '@/lib/database/models/member.model';

export type NewMinistryroleProps = {
    infoMode:boolean,
    minId:string;
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentMinister:IMinistryrole|null,
    setCurrentMinister:Dispatch<SetStateAction<IMinistryrole|null>>,
}

const NewMinistryrole = ({infoMode, setInfoMode, minId, currentMinister, setCurrentMinister}:NewMinistryroleProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [memberId, setMemberId] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const {user} = useAuth();
    const member = currentMinister?.memberId as unknown as IMember;
    const {refetch} = useFetchMinistryroleforMinistry(minId)

    const formRef = useRef<HTMLFormElement>(null)
   
    const handleClose = ()=>{
        setCurrentMinister(null);
        setInfoMode(false);
    }

    const handleNewMinistryrole = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const body:Partial<IMinistryrole>={
                memberId, minId, title, churchId:user?.churchId
            }
            const res = await createMinistryrole(body);
            setResponse(res);
            refetch();
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured creating room', error:true})
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateMinistryrole = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            if(currentMinister){
                const body:Partial<IMinistryrole> = {
                    _id:currentMinister?._id,
                    memberId:memberId || currentMinister?.memberId,
                    title:title || currentMinister?.title,
                }
                const res = await updateMinistryrole(body);
                setResponse(res);
                refetch();
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
            <form onSubmit={ currentMinister ? handleUpdateMinistryrole : handleNewMinistryrole} ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentMinister ? "Edit Role":"Create Role"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Role title</span>
                        <input onChange={(e)=>setTitle(e.target.value)} name='title' required={!currentMinister} defaultValue={currentMinister?.title} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Assign to</span>
                        <SearchSelectMembers require={!currentMinister} setSelect={setMemberId} value={member?.name} />
                    </div>
                    
                                        
                </div>

                {
                    response?.message &&
                    <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
                }

                <div className="flex flex-row items-center gap-6">
                    <AddButton disabled={loading} type='submit'  className='rounded w-[45%] justify-center' text={loading ? 'loading...' : currentMinister? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewMinistryrole