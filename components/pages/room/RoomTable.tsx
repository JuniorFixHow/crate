'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {  Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import SearchBar from "@/components/features/SearchBar";
import AddButton from "@/components/features/AddButton";
// import SearchSelectEvents from "@/components/features/SearchSelectEvents";
import {  SearchRoomV2 } from "./fxn";
import { RoomsColumns } from "./RoomsCoulmns";
import DeleteDialog from "@/components/DeleteDialog";
import RoomInfoModal from "./RoomInfoModal";
import NewRoom from "./NewRoom";
import { deleteRoom, getRoom } from "@/lib/actions/room.action";
import { IRoom } from "@/lib/database/models/room.model";
import { useFetchRooms } from "@/hooks/fetch/useRoom";
// import { ErrorProps } from "@/types/Types";
import { enqueueSnackbar } from "notistack";
import SearchSelectEventsV4 from "@/components/features/SearchSelectEventsV4";
import { useAuth } from "@/hooks/useAuth";
import { canPerformAction, canPerformEvent, eventOrganizerRoles, eventRoles, facilityRoles, roomRoles, venueRoles } from "@/components/auth/permission/permission";

const RoomTable = () => {
    const {user} = useAuth();
    const router = useRouter();
    const [currentRoom, setCurrentRoom] = useState<IRoom|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [search, setSearch] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    // const [response, setReponse] = useState<ErrorProps>(null);

    const searchParams = useSearchParams();

    const {rooms, loading, refetch} = useFetchRooms();

    const reader = canPerformAction(user!, 'reader', {roomRoles}) || canPerformEvent(user!, 'reader', {eventOrganizerRoles});
    const updater = canPerformAction(user!, 'updater', {roomRoles}) || canPerformEvent(user!, 'updater', {eventOrganizerRoles}) ;
    const deleter = canPerformAction(user!, 'deleter', {roomRoles}) || canPerformEvent(user!, 'deleter', {eventOrganizerRoles}) ;
    const creator = canPerformAction(user!, 'creator', {roomRoles}) || canPerformEvent(user!, 'creator', {eventOrganizerRoles}) ;
    const admin = canPerformAction(user!, 'admin', {roomRoles}) || canPerformEvent(user!, 'admin', {eventOrganizerRoles}) ;
    const facReader = canPerformAction(user!, 'reader', {facilityRoles}) || canPerformEvent(user!, 'reader', {eventOrganizerRoles}) ;
    const venueReader = canPerformAction(user!, 'reader', {venueRoles}) || canPerformEvent(user!, 'reader', {eventOrganizerRoles}) ;
    const eventReader = canPerformAction(user!, 'reader', {eventRoles}) || canPerformEvent(user!, 'reader', {eventOrganizerRoles}) ;

    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Room Admin')
        }
    },[admin, user, router])
   
    useEffect(() => {
        const fetchChurch = async () => {
          const data = searchParams?.get('id');
          if (data) {
            const room: IRoom = await getRoom(data); // Await the promise
            setCurrentRoom(room);
            setInfoMode(true);
          }
        };
      
        fetchChurch(); // Call the async function
      }, [searchParams]);

    const paginationModel = { page: 0, pageSize: 10 };

    const handleNewRoom = (data:IRoom)=>{
        setCurrentRoom(data);
        setNewMode(true);
    }

    const hadndleInfo = (data:IRoom)=>{
        setCurrentRoom(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:IRoom)=>{
        setCurrentRoom(data);
        setDeleteMode(true);
    }

    const handleDeleteRoom = async()=>{
        try {
            if(currentRoom){
                const res = await deleteRoom(currentRoom._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false)
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing room', {variant:'error'});
        }
    }

    const handleOpenNew = () =>{
        setNewMode(true);
        setCurrentRoom(null);
    }

    const message = `Deleting a room will also unassign all members allocated to it. You're rather advised to edit the room or unassign the unwanted members. Do you want to continue?`;

    if(!admin) return

    return (
      <div className='table-main2' >
          <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
            <SearchSelectEventsV4 setSelect={setEventId} />
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
                {
                    creator &&
                    <AddButton onClick={handleOpenNew} smallText text='Add Room' noIcon className='rounded py-2' />
                }
                {/* <button className="px-4 py-1 border-2 rounded bg-transparent" >Import Excel</button> */}
            </div>
          </div> 
          <RoomInfoModal venueReader={venueReader} eventReader={eventReader} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} infoMode={infoMode} setInfoMode={setInfoMode} />
          <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete room ${currentRoom?.number}`} message={message} onTap={handleDeleteRoom} />
          <NewRoom updater={updater} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} infoMode={newMode} setInfoMode={setNewMode} />
  
            {/* {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
            } */}
          <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    rows={SearchRoomV2(rooms,  eventId)}
                    columns={RoomsColumns(hadndleInfo,  hadndleDelete, handleNewRoom, reader, updater, deleter, facReader)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                    getRowId={(row:IRoom):string=>row._id}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                    slots={{toolbar:GridToolbar}}
                    loading={loading}
                    slotProps={{
                        toolbar:{
                            showQuickFilter:true,
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true
                            }
                        }
                    }}
                />
            </Paper>
          </div>
  
      </div>
    )
}

export default RoomTable