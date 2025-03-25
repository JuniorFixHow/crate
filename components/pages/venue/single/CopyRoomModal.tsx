import AddButton from "@/components/features/AddButton";
// import SearchSelectEvents from "@/components/features/SearchSelectEvents";
import { ErrorProps } from "@/types/Types";
import { Alert, Modal } from "@mui/material";
import { Dispatch, FormEvent, SetStateAction,  useState } from "react";
import { IRoom } from "@/lib/database/models/room.model";
import { createRooms } from "@/lib/actions/room.action";
import SearchSelectEventsV3 from "@/components/features/SearchSelectEventsV3";

type CopyRoomModalProps = {
    infoMode:boolean;
    setInfoMode:Dispatch<SetStateAction<boolean>>;
    rooms:IRoom[];
}

const CopyRoomModal = ({infoMode, setInfoMode, rooms}:CopyRoomModalProps) => {
    const [eventId, setEventId] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [loading, setLoading] = useState<boolean>(false);

    

    const handleLoadRooms = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const filteredRooms:Partial<IRoom>[] = rooms.map((room)=>({
                facId:room.facId,
                churchId:room.churchId,
                floor:room?.floor,
                nob:room.nob,
                number:room?.number,
                venueId:room.venueId,
                roomType:room.roomType,
                bedType:room.bedType,
                features:room.features,
                eventId,
            }))
            
            const res = await createRooms(filteredRooms);
            setResponse(res);
            setEventId('');   
        } catch (error) {
            console.error('Error inserting rooms:', error);
            setResponse({ message: 'Error occurred inserting rooms', error: true });
        } finally {
            setLoading(false);
        }
    };
    
    const handleClose = ()=>{
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
            <form onSubmit={handleLoadRooms}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200 text-center md:text-left' >Copy rooms to an event</span>
                <div className="flex flex-col w-full items-center">
                    <span className="dark:text-white text-sm italic font-bold" >{rooms?.length > 0 ? `${rooms.length} rooms selected`:`${rooms?.length} selected`}</span>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Choose Event</span>
                        <SearchSelectEventsV3 setSelect={setEventId} require />
                    </div>
                    
                                      
                </div>

                {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error ? `error`:'success'} >{response.message}</Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    {
                        eventId &&
                        <AddButton disabled={loading} type="submit"  className='rounded w-[45%] justify-center' text={loading? 'loading...' :'Proceed'} smallText noIcon />
                    }
                    <AddButton disabled={loading} type="button"  className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default CopyRoomModal