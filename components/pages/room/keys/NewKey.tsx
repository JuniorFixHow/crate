'use client'

import AddButton from "@/components/features/AddButton"
import SearchSelectEvents from "@/components/features/SearchSelectEvents"
import SearchSelectMemberForKey from "@/components/features/SearchSelectMemberForKey"
import SearchSelectRooms from "@/components/features/SearchSelectRooms"
import { useFetchMembersInRoom } from "@/hooks/fetch/useRoom"
import { createKey, returnKey, updateKey } from "@/lib/actions/key.action"
import { IKey } from "@/lib/database/models/key.model"
import { ErrorProps } from "@/types/Types"
import { Alert, Modal } from "@mui/material"
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react"

type NewKeyProps = {
    editMode:boolean,
    setEditMode:Dispatch<SetStateAction<boolean>>,
    currentKey:IKey|null,
    setCurrentKey:Dispatch<SetStateAction<IKey|null>>,
}

const NewKey = ({editMode, setEditMode, currentKey, setCurrentKey}:NewKeyProps) => {
    const [response, setResponse] = useState<ErrorProps>(null);
    const [roomId, setRoomId] = useState<string>('');
    const [memberId, setMemberId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [code, setCode] =useState<string>('');
    const [eventId, setEventId] =useState<string>('');
    const [returnLoading, setReturnLoading] =useState<boolean>(false);

    const {members} = useFetchMembersInRoom(roomId)

    const handleClose = ()=>{
        setEditMode(false);
        setCurrentKey(null);
    }

    const formRef = useRef<HTMLFormElement>(null);

    const handleNewKey = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);

        try {
            setLoading(true);
            let data:Partial<IKey>;
            if(memberId){
                data = {
                    code, roomId, holder:memberId,
                    assignedOn:new Date().toISOString(),
                    returned:false
                }
            }else{
                data = {
                    code, roomId, returned:false
                }
            }
            const res = await createKey(data);
            formRef.current?.reset();
            setResponse(res);
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured creating key', error:true})
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateKey = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);

        try {
            setLoading(true);
            if(currentKey){

                let data:Partial<IKey>; 
                if(memberId){
                    data = {
                        code:code||currentKey.code, 
                        roomId:roomId||currentKey.roomId, 
                        holder:memberId,
                        assignedOn:new Date().toISOString(),
                        returned:false,
                    }
                }else{
                    data = {
                        code:code||currentKey.code, 
                        roomId:roomId||currentKey.roomId, 
                    }
                }
                const res = await updateKey(currentKey._id, data);
                setResponse(res);
                const key = res?.payload as IKey;
                setCurrentKey(key);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured updating key', error:true})
        }finally{
            setLoading(false);
        }
    }

    // console.log(new Date().toISOString())

    const handleReturn = async()=>{
        setResponse(null);
        try {
            setReturnLoading(true);
            if(currentKey){
                const res = await returnKey(currentKey._id);
                setResponse(res);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured updating return status', error:true})
        }finally{
            setReturnLoading(false);
        }
    }

  return (
    <Modal
    open={editMode}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    
    >
    <div className='flex size-full items-center justify-center'>
        <form ref={formRef} onSubmit={currentKey ? handleUpdateKey : handleNewKey}  className="new-modal scrollbar-custom overflow-y-scroll">
            <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentKey ? "Edit Key":"Create Key"}</span>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem]' >Key Code</span>
                    <input onChange={(e)=>setCode(e.target.value)} name='venue' required={!currentKey} defaultValue={currentKey?.code} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                </div>

                <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem]' >Select Event</span>
                    <SearchSelectEvents isGeneric setSelect={setEventId} />
                </div>

                <div className="flex gap-12 items-end">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Select Room</span>
                        <SearchSelectRooms eventId={eventId} isGeneric require={!currentKey} setSelect={setRoomId} />
                    </div>
                    {
                        roomId && members.length > 0 &&
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Keeper</span>
                            <SearchSelectMemberForKey isGeneric require={members.length > 0} setSelect={setMemberId} members={members} />
                        </div>
                    }
                </div>

            </div>
            

            {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
            }

            <div className="flex flex-row items-center gap-6">
                <AddButton disabled={loading} type='submit'  className='rounded w-[45%] justify-center' text={loading ? 'loading...' : currentKey? 'Update':'Add'} smallText noIcon />
                {
                    currentKey && currentKey?.holder &&
                    <AddButton disabled={returnLoading} isCancel onClick={handleReturn} type='button'  className='rounded w-[45%] justify-center' text={returnLoading ? 'loading...' : currentKey?.returned ? 'Deem Unreturned':'Deem Returned' } smallText noIcon />
                }
                <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isDanger onClick={handleClose} smallText noIcon />
            </div>
        </form>
    </div>
</Modal>
  )
}

export default NewKey