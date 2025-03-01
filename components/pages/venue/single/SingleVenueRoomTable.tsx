'use client'

import {  useState } from "react";
import { Alert,  Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import SearchBar from "@/components/features/SearchBar";
import AddButton from "@/components/features/AddButton";
// import SearchSelectEvents from "@/components/features/SearchSelectEvents";
import DeleteDialog from "@/components/DeleteDialog";
import { deleteRoom } from "@/lib/actions/room.action";
import { IRoom } from "@/lib/database/models/room.model";
import {  useFetchRoomsForVenue } from "@/hooks/fetch/useRoom";
import { ErrorProps } from "@/types/Types";
import { SingleVenueRoomsColumns } from "./SingleVenueRoomColumns";
import SingleVenueRoomInfoModal from "./SingleVenueRoomModal";
import { SearchRoomV2 } from "../../room/fxn";
import SingleVenueNewRoom from "./SingleVenueNewRoom";
// import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import ImportRoomModal from "./ImportRoomModal";
import { MdChecklist, MdOutlineContentCopy } from "react-icons/md";
import { LuCopyX } from "react-icons/lu";
import CopyRoomModal from "./CopyRoomModal";
import { ExcelButton } from "@/components/features/Buttons";
import SearchSelectEventsV2 from "@/components/features/SearchSelectEventsV2";


type SingleVenueRoomTableProps = {
    venueId:string
}

const SingleVenueRoomTable = ({venueId}:SingleVenueRoomTableProps) => {
    const [currentRoom, setCurrentRoom] = useState<IRoom|null>(null);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    // const [search, setSearch] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [response, setReponse] = useState<ErrorProps>(null);
    const [excelMode, setExcelMode] = useState<boolean>(false);
    const [selection, setSelection] = useState<IRoom[]>([]);
    const [copyMode, setCopyMode] = useState<boolean>(false);
    
    const {rooms, loading} = useFetchRoomsForVenue(venueId)
   
  
    const searched = SearchRoomV2(rooms, eventId)

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
    const hadndleSelection = (data:IRoom)=>{
        setSelection((prev)=>{
            const select = prev.find((item)=>item._id === data._id);
            return select ? prev.filter((item)=>item._id !== data._id)
            :
            [...prev, data]
        })
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

    // console.log(selection)


    const message = `Deleting a room will also unassign all members allocated to it. You're rather advised to edit the room or unassign the unwanted members. Do you want to continue?`
    return (
      <div className='table-main2' >
          <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
            <SearchSelectEventsV2 setSelect={setEventId}  />
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
               
                <ExcelButton text="Import" onClick={()=>setExcelMode(true)} />
                <AddButton onClick={handleOpenNew} smallText text='Add Room' noIcon className='rounded py-[0.4rem]' />
            </div>
          </div> 
          <ImportRoomModal venueId={venueId} setInfoMode={setExcelMode} infoMode={excelMode} />
          <SingleVenueRoomInfoModal currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} infoMode={infoMode} setInfoMode={setInfoMode} />
          <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete room ${currentRoom?.number}`} message={message} onTap={handleDeleteRoom} />
          <SingleVenueNewRoom venueId={venueId} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} infoMode={newMode} setInfoMode={setNewMode} />
          <CopyRoomModal infoMode={copyMode} setInfoMode={setCopyMode} rooms={selection} />
  
            {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
            }
          <div className="flex w-full">
            {
                // loading ?
                // <LinearProgress className="w-full" />
                // :
                <div className="flex flex-col gap-4 w-full">
                    {
                        selection.length > 0 &&
                        <div className="flex gap-4 items-center">
                            <div onClick={()=>setSelection(searched)}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                                <div className="flex-center p-1 bg-slate-400 rounded-full">
                                    <MdChecklist />
                                </div>
                                <span className="dark:text-black text-sm" >Select All</span>
                            </div>
                            <div onClick={()=>setSelection([])}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                                <div className="flex-center p-1 bg-slate-400 rounded-full">
                                    <LuCopyX />
                                </div>
                                <span className="dark:text-black text-sm" >Cancel Selections</span>
                            </div>
                            <div onClick={()=>setCopyMode(true)}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                                <div className="flex-center p-1 bg-slate-400 rounded-full">
                                    <MdOutlineContentCopy />
                                </div>
                                <span className="dark:text-black text-sm" >Copy</span>
                            </div>
                        </div>
                    }
                    <Paper className='w-full' sx={{ height: 480, }}>
                        <DataGrid
                            loading={loading}
                            rows={SearchRoomV2(rooms, eventId)}
                            columns={SingleVenueRoomsColumns(handleNewRoom, hadndleInfo, handleDelete, selection, hadndleSelection)}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            getRowId={(row:IRoom):string=>row._id}
                            slots={{
                                toolbar:GridToolbar
                            }}
                            // checkboxSelection
                            className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                            sx={{ border: 0 }}
                        />
                    </Paper>
                </div>
            }
          </div>
  
      </div>
    )
}

export default SingleVenueRoomTable