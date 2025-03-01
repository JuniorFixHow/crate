import AddButton from "@/components/features/AddButton";
import SearchSelectEvents from "@/components/features/SearchSelectEvents";
import SearchSelectFacilities from "@/components/features/SearchSelectFacilities";
import { ErrorProps } from "@/types/Types";
import { Alert, Modal } from "@mui/material";
import Image from "next/image";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { readRoomsFromExcel } from "./fxn";
import { IRoom } from "@/lib/database/models/room.model";
import { LuUpload } from "react-icons/lu";
import { IFacility } from "@/lib/database/models/facility.model";
import { generateNumberArray } from "@/functions/misc";
import { useAuth } from "@/hooks/useAuth";
import { createRooms } from "@/lib/actions/room.action";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useFetchRoomsForVenue } from "@/hooks/fetch/useRoom";

type ImportRoomModalProps = {
    infoMode:boolean;
    setInfoMode:Dispatch<SetStateAction<boolean>>;
    venueId:string;
}

const ImportRoomModal = ({infoMode, setInfoMode, venueId}:ImportRoomModalProps) => {
    const [facId, setFacId] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [facility, setFacility] = useState<IFacility|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [roomsData, setRoomsData] = useState<Partial<IRoom>[]>([]);
    const {user} = useAuth();
    const {refetch} = useFetchRoomsForVenue(venueId);

    const fileRef = useRef<HTMLInputElement>(null);
    const handleClose =()=>{
        setInfoMode(false);
        setFacId('');
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          try {
            const data = await readRoomsFromExcel(file);
            setRoomsData(data);
            // console.log(data);
          } catch (error) {
            console.error("Error reading Excel file:", error);
          }
        }
    };

    const handleLoadRooms = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
    
            if (roomsData.length === 0) {
                setResponse({ message: 'No rooms fetched', error: true });
                return;
            }
    
            const floors = generateNumberArray(facility!.floor);
            // console.log(roomsData[1].floor)
            const validRooms: Partial<IRoom>[] = roomsData.filter((room) => room.floor && floors.includes(room.floor.toString()));
            console.log(validRooms)
    
            if (validRooms.length > 0) {
                const resMessage = `${validRooms.length} of ${roomsData.length} rooms inserted successfully`;
    
                const body: Partial<IRoom>[] = validRooms.map((room) => ({
                    ...room,
                    churchId: user?.churchId,
                    facId,
                    venueId,
                    eventId,
                }));
    
                const res = await createRooms(body);
                setResponse({ message: resMessage, error: false });
                refetch();
                setFacId('');
                setEventId('');
                setInfoMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            } else {
                setResponse({ message: 'No valid rooms found in the dataset', error: true });
            }
        } catch (error) {
            console.error('Error inserting rooms:', error);
            setResponse({ message: 'Error occurred inserting rooms', error: true });
        } finally {
            setLoading(false);
        }
    };
    

    const loadFile = async()=>{
        fileRef.current?.click()
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
                <span className='text-[1.5rem] font-bold dark:text-slate-200 text-center md:text-left' >Import Rooms</span>
                <div className="flex flex-col w-full items-center">
                    <div className="w-32 h-20 relative">
                        <Image alt="excel" fill src='/excel.png' />
                    </div>
                    <div onClick={loadFile} className="flex-center p-1 border rounded-full bg-transparent cursor-pointer">
                        <LuUpload className="dark:text-white" size={26} />
                    </div>
                    <input ref={fileRef}  className="hidden" type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                    <span className="text-[0.8rem] italic font-bold mt-2 dark:text-slate-400" >{roomsData?.length+' rooms loaded'}</span>
                    <Link href='/docs/Rooms.xlsx' download='Rooms.xlsx'   className="table-link w-fit text-center" >Download upload template</Link>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Choose Event</span>
                        <SearchSelectEvents setSelect={setEventId} isGeneric require />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Select Facility</span>
                        <SearchSelectFacilities setCurrentFacility={setFacility} venueId={venueId} isGeneric setSelect={setFacId} require />
                    </div>
                    
                                      
                </div>

                {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error ? `error`:'success'} >{response.message}</Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    {
                        facId && eventId &&
                        <AddButton disabled={loading} type="submit"  className='rounded w-[45%] justify-center' text={loading? 'loading...' :'Proceed'} smallText noIcon />
                    }
                    <AddButton disabled={loading} type="button"  className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default ImportRoomModal