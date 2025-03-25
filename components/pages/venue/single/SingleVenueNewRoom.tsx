import AddButton from '@/components/features/AddButton'
import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import { Alert, Modal } from '@mui/material';
// import SearchSelectEvents from '@/components/features/SearchSelectEvents';
import { IRoom } from '@/lib/database/models/room.model';
import { ErrorProps } from '@/types/Types';
import { createRoom, updateRoom } from '@/lib/actions/room.action';
// import SearchSelectFacilities from '@/components/features/SearchSelectFacilities';
import { useAuth } from '@/hooks/useAuth';
import { IFacility } from '@/lib/database/models/facility.model';
import { generateNumberArray } from '@/functions/misc';
import { IEvent } from '@/lib/database/models/event.model';
import SearchSelectEventsV3 from '@/components/features/SearchSelectEventsV3';
import SearchSelectVenueFacilities from '@/components/features/SearchSelectVenueFacilities';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { canPerformAction, roomRoles } from '@/components/auth/permission/permission';

export type SingleVenueNewRoomProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentRoom:IRoom|null,
    setCurrentRoom:Dispatch<SetStateAction<IRoom|null>>,
    venueId:string,
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IRoom[], Error>>
}

const SingleVenueNewRoom = ({infoMode, setInfoMode, refetch, currentRoom, setCurrentRoom, venueId}:SingleVenueNewRoomProps) => {
    const [data, setData] = useState<Partial<IRoom>>({});
    const [eventId, setEventId] = useState<string>('');
    const [facId, setFacId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentFacility, setCurrentFacility] = useState<IFacility|null>(null);

    const {user} = useAuth();
    const updater = canPerformAction(user!, 'updater', {roomRoles});
    const event = currentRoom?.eventId as IEvent;
    const facility = currentRoom?.facId as IFacility;

    const formRef = useRef<HTMLFormElement>(null)
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    // console.log('Facility: ',currentFacility);

    const handleClose = ()=>{
        setCurrentRoom(null);
        setInfoMode(false);
        setCurrentFacility(null);
    }

    const handleSingleVenueNewRoom = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const body:Partial<IRoom> = {
                ...data, 
                eventId,
                facId,
                venueId,
                churchId:user?.churchId
            }
            const res = await createRoom(body);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            formRef.current?.reset();
            refetch();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating room', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateSingleVenueNewRoom = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            if(currentRoom){
                const body:Partial<IRoom> = {
                    floor:data.floor || currentRoom.floor,
                    number:data.number || currentRoom.number,
                    roomType:data.roomType || currentRoom.roomType,
                    bedType:data.bedType || currentRoom.bedType,
                    nob:data.nob || currentRoom.nob,
                    features:data.features || currentRoom.features,
                    eventId: eventId||currentRoom.eventId,
                    venueId: eventId||currentRoom.venueId,
                    facId: facId||currentRoom.facId,
                }
                const res=  await updateRoom(currentRoom._id, body);
                setCurrentRoom(res?.payload as IRoom);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating room', {variant:'error'});
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
            <form onSubmit={ currentRoom ? handleUpdateSingleVenueNewRoom : handleSingleVenueNewRoom} ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentRoom ? "Edit Room":"Create Room"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Select Event</span>
                        <SearchSelectEventsV3 setSelect={setEventId} require={!currentRoom} value={event?.name} />
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-12 md:items-end">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Facility</span>
                            <SearchSelectVenueFacilities setCurrentFacility={setCurrentFacility} venueId={venueId} value={facility?.name} setSelect={setFacId} require={!currentRoom} />
                        </div>                        
                        {
                            currentFacility &&
                            <div className="flex flex-col">
                                <span className='text-slate-500 text-[0.8rem]' >Floor</span>
                                <select onChange={handleChange} required={!currentRoom}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRoom?.roomType} name="floor">
                                    <option className='dark:bg-black dark:text-white' value="">select</option>
                                    {
                                        generateNumberArray(currentFacility?.floor).map((item)=>(
                                            <option key={item}  className='dark:bg-black dark:text-white' value={item}>{item}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        }
                    </div>
                    
                    <div className="flex gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Room type</span>
                            <select onChange={handleChange} required={!currentRoom}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRoom?.roomType} name="roomType">
                                <option className='dark:bg-black dark:text-white' value="">select</option>
                                <option className='dark:bg-black dark:text-white' selected value="Standard">Standard</option>
                                <option className='dark:bg-black dark:text-white' value="Deluxe">Deluxe</option>
                                <option className='dark:bg-black dark:text-white' value="Junior Suite">Junior Suite</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Bed type</span>
                            <select onChange={handleChange} required={!currentRoom}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRoom?.bedType} name="bedType">
                                <option className='dark:bg-black dark:text-white' value="">select</option>
                                <option className='dark:bg-black dark:text-white' value="Standard">Standard</option>
                                <option className='dark:bg-black dark:text-white' value="Queen size">Queen size</option>
                                <option className='dark:bg-black dark:text-white' value="King size">King size</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-12 items-end">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Room number</span>
                            <input onChange={handleChange} name='number' required={!currentRoom} defaultValue={currentRoom?.number} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
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
                    <AddButton disabled={loading} type='submit'  className={`${currentRoom && !updater && 'hidden'} rounded w-[45%] justify-center`} text={loading ? 'loading...' : currentRoom? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default SingleVenueNewRoom