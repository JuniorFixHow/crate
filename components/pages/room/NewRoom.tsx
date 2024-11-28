import AddButton from '@/components/features/AddButton'
import React from 'react'
import { RoomInfoModalProps } from './RoomInfoModal';
import { Modal } from '@mui/material';
import SearchSelectEvents from '@/components/features/SearchSelectEvents';

const NewRoom = ({infoMode, setInfoMode, currentRoom, setCurrentRoom}:RoomInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentRoom(null);
        setInfoMode(false);
    }
  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <form className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentRoom ? "Edit Room":"Create Room"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Venue</span>
                        <input defaultValue={currentRoom?.venue} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    <div className="flex gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Floor</span>
                            <input min={0} defaultValue={currentRoom?.floor} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Room number</span>
                            <input defaultValue={currentRoom?.number} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>
                    </div>

                    <div className="flex gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Room type</span>
                            <select  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRoom? currentRoom.roomType:'Standard'} name="country">
                                <option className='dark:bg-black dark:text-white' value="Standard">Standard</option>
                                <option className='dark:bg-black dark:text-white' value="Deluxe">Deluxe</option>
                                <option className='dark:bg-black dark:text-white' value="Junior Suite">Junior Suite</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Bed type</span>
                            <select  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRoom? currentRoom.bedType:'Standard'} name="country">
                                <option className='dark:bg-black dark:text-white' value="Standard">Standard</option>
                                <option className='dark:bg-black dark:text-white' value="Queen size">Queen size</option>
                                <option className='dark:bg-black dark:text-white' value="King size">King size</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Event</span>
                            <SearchSelectEvents isGeneric />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >No. of beds</span>
                            <input min={1} defaultValue={currentRoom?.nob} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Room features</span>
                        <textarea  defaultValue={currentRoom?.features}  className='border rounded px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    
                </div>



                <div className="flex flex-row items-center gap-6">
                    <AddButton className='rounded w-[45%] justify-center' text={currentRoom? 'Update':'Add'} smallText noIcon />
                    <AddButton className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewRoom