import { Modal } from '@mui/material'
import { IoIosArrowRoundBack } from "react-icons/io";
import '@/components/features/customscroll.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NewSingleFacilityProps } from './NewFacility';
import { getRoomsForFacility } from '@/lib/actions/room.action';
import { IRoom } from '@/lib/database/models/room.model';
import { IVenue } from '@/lib/database/models/venue.model';



const FacilityInfoModal = ({infoMode, setInfoMode, currentFacility, setCurrentFacility}:NewSingleFacilityProps) => {

    const [rooms, setRooms] = useState<IRoom[]>([]);
    const venue = currentFacility?.venueId as IVenue;

    useEffect(()=>{
        const fetchContracts = async()=>{
            if(currentFacility){
                const conts = await getRoomsForFacility(currentFacility?._id)
                setRooms(conts);
            }
        }
        fetchContracts()
    },[currentFacility])

    const handleClose = ()=>{
        setCurrentFacility(null);
        setInfoMode(false);
    }
  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='flex size-full justify-end'
    >
        <div className="flex flex-col min-w-72 h-full bg-white dark:bg-[#0F1214] dark:border rounded-l-lg p-4 overflow-y-scroll scrollbar-custom">
            <div onClick={handleClose}  className="flex gap-1 cursor-pointer dark:text-white items-center mb-5">
               <IoIosArrowRoundBack size={24} /> 
               <span>Close</span>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col dark:text-slate-200">
                    <span   className='text-[1.3rem] font-bold' >{currentFacility?.name}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Rooms</span>
                    <span className='text-[0.9rem]' >{currentFacility?.rooms}</span>
                </div>

                <div className="flex flex-col dark:text-slate-200 max-w-80">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Floors</span>
                    <span className='text-[0.9rem]' >{currentFacility?.floor}</span>
                </div>
                <div className="flex flex-col dark:text-slate-200 max-w-80">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Venue</span>
                    <Link className='table-link' href={`/dashboard/venues/${venue?._id}`} >{venue?.name}</Link>
                </div>
                <div className="flex flex-col dark:text-slate-200">
                    <span className='text-[1.1rem] font-semibold text-slate-700' >Rooms</span>
                    <div className="flex flex-col">
                        {
                            rooms?.length > 0 ?
                            rooms.map((room)=>(
                                <Link key={room._id} className='table-link' href={{pathname:`/dashboard/rooms`, query:{id:room?._id}}} >{room?.number} - {room?.roomType}</Link>
                            ))
                            :
                            <span className='text-[0.9rem]' >None</span>
                        }
                    </div>
                </div>
                            
            </div>
        </div>
    </Modal>
  )
}

export default FacilityInfoModal