import AddButton from '@/components/features/AddButton'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { RoomInfoModalProps } from './RoomInfoModal';
import { Alert, Modal } from '@mui/material';
import SearchSelectEvents from '@/components/features/SearchSelectEvents';
import { IRoom } from '@/lib/database/models/room.model';
import { ErrorProps } from '@/types/Types';
import { createRoom, updateRoom } from '@/lib/actions/room.action';

const NewRoom = ({infoMode, setInfoMode, currentRoom, setCurrentRoom}:RoomInfoModalProps) => {
    const [data, setData] = useState<Partial<IRoom>>({});
    const [eventId, setEventId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);

    const formRef = useRef<HTMLFormElement>(null)
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleClose = ()=>{
        setCurrentRoom(null);
        setInfoMode(false);
    }

    const handleNewRoom = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const body:Partial<IRoom> = {
                ...data, 
                eventId
            }
            await createRoom(body);
            setResponse({message:'Room created successfully', error:false});
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured creating room', error:true})
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateRoom = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            if(currentRoom){
                const body:Partial<IRoom> = {
                    venue:data.venue || currentRoom.venue,
                    floor:data.floor || currentRoom.floor,
                    number:data.number || currentRoom.number,
                    roomType:data.roomType || currentRoom.roomType,
                    bedType:data.bedType || currentRoom.bedType,
                    nob:data.nob || currentRoom.nob,
                    features:data.features || currentRoom.features,
                    eventId: eventId||currentRoom.eventId,
                }
                const res=  await updateRoom(currentRoom._id, body);
                setCurrentRoom(res);
                setResponse({message:'Room updated successfully', error:false});
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
            <form onSubmit={ currentRoom ? handleUpdateRoom : handleNewRoom} ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentRoom ? "Edit Room":"Create Room"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Venue</span>
                        <input onChange={handleChange} name='venue' required={!currentRoom} defaultValue={currentRoom?.venue} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    <div className="flex gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Floor</span>
                            <input onChange={handleChange} name='floor'  defaultValue={currentRoom?.floor} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Room number</span>
                            <input onChange={handleChange} name='number' required={!currentRoom} defaultValue={currentRoom?.number} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>
                    </div>

                    <div className="flex gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Room type</span>
                            <select onChange={handleChange} required={!currentRoom}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRoom? currentRoom.roomType:'Standard'} name="roomType">
                                <option className='dark:bg-black dark:text-white' value="Standard">Standard</option>
                                <option className='dark:bg-black dark:text-white' value="Deluxe">Deluxe</option>
                                <option className='dark:bg-black dark:text-white' value="Junior Suite">Junior Suite</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Bed type</span>
                            <select onChange={handleChange} required={!currentRoom}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRoom? currentRoom.bedType:'Standard'} name="bedType">
                                <option className='dark:bg-black dark:text-white' value="Standard">Standard</option>
                                <option className='dark:bg-black dark:text-white' value="Queen size">Queen size</option>
                                <option className='dark:bg-black dark:text-white' value="King size">King size</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Event</span>
                            <SearchSelectEvents setSelect={setEventId} require={!currentRoom} isGeneric />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >No. of beds</span>
                            <input onChange={handleChange} name='nob' required={!currentRoom} min={1} defaultValue={currentRoom?.nob} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Room features</span>
                        <textarea onChange={handleChange} name='features' defaultValue={currentRoom?.features}  className='border rounded px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    
                </div>

                {
                    response?.message &&
                    <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
                }

                <div className="flex flex-row items-center gap-6">
                    <AddButton disabled={loading} type='submit'  className='rounded w-[45%] justify-center' text={loading ? 'loading...' : currentRoom? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewRoom