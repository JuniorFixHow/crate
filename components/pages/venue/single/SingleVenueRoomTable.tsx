'use client'

import {  useState } from "react";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchBar from "@/components/features/SearchBar";
import AddButton from "@/components/features/AddButton";
import SearchSelectEvents from "@/components/features/SearchSelectEvents";
import DeleteDialog from "@/components/DeleteDialog";
import { deleteRoom } from "@/lib/actions/room.action";
import { IRoom } from "@/lib/database/models/room.model";
import {  useFetchRoomsForVenue } from "@/hooks/fetch/useRoom";
import { ErrorProps } from "@/types/Types";
import { SingleVenueRoomsColumns } from "./SingleVenueRoomColumns";
import SingleVenueRoomInfoModal from "./SingleVenueRoomModal";
import { SearchRoom } from "../../room/fxn";
import SingleVenueNewRoom from "./SingleVenueNewRoom";


type SingleVenueRoomTableProps = {
    venueId:string
}

const SingleVenueRoomTable = ({venueId}:SingleVenueRoomTableProps) => {
    const [currentRoom, setCurrentRoom] = useState<IRoom|null>(null);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [response, setReponse] = useState<ErrorProps>(null);


    const {rooms, loading} = useFetchRoomsForVenue(venueId)
   
  

    const paginationModel = { page: 0, pageSize: 10 };

    const handleNewRoom = (data:IRoom)=>{
        setCurrentRoom(data);
        setNewMode(true);
    }

    const handleDelete = (data:IRoom)=>{
        setCurrentRoom(data);
        setDeleteMode(true);
    }

    const hadndleInfo = (data:IRoom)=>{
        setCurrentRoom(data);
        setInfoMode(true);
    }

    const handleDeleteRoom = async()=>{
        try {
            if(currentRoom){
                await deleteRoom(currentRoom._id);
                setReponse({message:'Room removed sucsessfully', error:false});
                setDeleteMode(false)
            }
        } catch (error) {
            console.log(error);
            setReponse({message:'Error occured removing room', error:true})
        }
    }

    const handleOpenNew = () =>{
        setNewMode(true);
        setCurrentRoom(null);
    }

    const message = `Deleting a room will also unassign all members allocated to it. You're rather advised to edit the room or unassign the unwanted members. Do you want to continue?`
    return (
      <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded' >
          <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
            <SearchSelectEvents setSelect={setEventId} isGeneric />
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <AddButton onClick={handleOpenNew} smallText text='Add Room' noIcon className='rounded py-2' />
                <button className="px-4 py-1 border-2 rounded bg-transparent" >Import Excel</button>
            </div>
          </div> 
          <SingleVenueRoomInfoModal currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} infoMode={infoMode} setInfoMode={setInfoMode} />
          <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete room ${currentRoom?.number}`} message={message} onTap={handleDeleteRoom} />
          <SingleVenueNewRoom venueId={venueId} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} infoMode={newMode} setInfoMode={setNewMode} />
  
            {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
            }
          <div className="flex w-full">
            {
                loading ?
                <LinearProgress className="w-full" />
                :
                <Paper className='w-full' sx={{ height: 480, }}>
                    <DataGrid
                        rows={SearchRoom(rooms, search, eventId)}
                        columns={SingleVenueRoomsColumns(handleNewRoom, hadndleInfo, handleDelete)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        getRowId={(row:IRoom):string=>row._id}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                    />
                </Paper>
            }
          </div>
  
      </div>
    )
}

export default SingleVenueRoomTable