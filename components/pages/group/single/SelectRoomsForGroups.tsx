import AddButton from "@/components/features/AddButton";
import { IGroup } from "@/lib/database/models/group.model";
import { IRoom } from "@/lib/database/models/room.model";
import { Alert, LinearProgress, Modal, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { SearchRoomsForSelections } from "./fxn";
import { useFetchAvailableRooms } from "@/hooks/fetch/useRoom";
import SearchBar from "@/components/features/SearchBar";
import { GroupSelectionCoulmns } from "./GroupSelectionCoulmns";
import { ErrorProps } from "@/types/Types";
import { Types } from "mongoose";
import { addGroupToRoom } from "@/lib/actions/room.action";

type SelectRoomsForGroupsProps = {
    showRooms:boolean,
    setShowRooms:Dispatch<SetStateAction<boolean>>,
    currentGroup:IGroup|null
}

const SelectRoomsForGroups = ({showRooms, currentGroup, setShowRooms}:SelectRoomsForGroupsProps) => {
    const [selectedRooms, setSelectedRooms] = useState<IRoom[]>([]);
    const [addLoading, setAddLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [total, setTotal] = useState<number>(0);
    const [response, setResponse] = useState<ErrorProps>(null);
    const eventId = (typeof currentGroup?.eventId === 'object' && currentGroup.eventId._id.toString()) || ''
    const {rooms, loading} = useFetchAvailableRooms( eventId)
    
    const paginationModel = { page: 0, pageSize: 10 };
    
    const handleSelect = (data:IRoom)=>{
        setSelectedRooms((previousSelection)=>{
            const selected = previousSelection.some((item)=>item._id === data._id);
            if(selected){
                return previousSelection.filter((item)=> item._id !== data._id)
            }else{
                return [...previousSelection, data]
            }
        })
    }

    
    useEffect(()=>{
        setTotal(selectedRooms.reduce((total, room)=> room.nob ? total+room.nob : total, 0))

    },[selectedRooms])

    const handleClose = ()=>{
        setShowRooms(false);
        setSelectedRooms([]);
        setTotal(0);
    }

    const addRooms = async () => {
        setResponse(null);
        try {
            setAddLoading(true);
    
            if (currentGroup) {
                // Extract room IDs from the current group, handling all possible types
                const existingRoomIds = (currentGroup.roomIds || []).map((room: IRoom | string | Types.ObjectId) => {
                    if (typeof room === 'object' && '_id' in room) {
                        return room._id.toString(); // Room is an object with _id property
                    }
                    return room.toString(); // Room is either a string or ObjectId
                });
    
                // Extract room IDs from selected rooms
                const selectedRoomIds = selectedRooms.map(room => room._id);
    
                // Combine existing and selected room IDs, ensuring uniqueness
                const roomIds = Array.from(new Set([...existingRoomIds, ...selectedRoomIds]));
    
                const res = await addGroupToRoom(roomIds, currentGroup._id, eventId)
    
                setResponse(res);
            } else {
                setResponse({ message: 'No group selected', error: true });
            }
        } catch (error) {
            console.error('Error occurred assigning rooms to group:', error);
            setResponse({ message: 'Error occurred assigning rooms to group', error: true });
        } finally {
            setAddLoading(false);
        }
    };
    
    
    
  return (
    <Modal
        open={showRooms}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex-center"
        >
        <div className="flex flex-col rounded p-6 bg-white dark:bg-black dark:border w-[90%] lg:w-[60%]">
            <div className="flex gap-4 items-center">
                <span className="text-[0.9rem]" >Selected rooms: <span className="font-semibold" >{selectedRooms.length}</span></span>
                <span className="text-[0.9rem]" >No. of Beds: <span className="font-semibold" >{total}</span></span>
            </div>

            <div className="flex w-full flex-col">
                <div className="flex items-start justify-end gap-4">
                    <SearchBar reversed={false} setSearch={setSearch} />
                    {
                        selectedRooms.length > 0 &&
                        <AddButton onClick={addRooms} disabled={addLoading}  className="rounded" noIcon smallText text={addLoading ? 'loading...':'Proceed'} />
                    }
                    <AddButton onClick={handleClose} isCancel disabled={addLoading}  className="rounded" noIcon smallText text="Cancel" />
                </div>
                {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
                }
                <div className="flex w-full">
                    {
                        loading ?
                        <LinearProgress className="w-full" />
                        :
                        <Paper className='w-full' sx={{ height: 480, }}>
                        <DataGrid
                            rows={SearchRoomsForSelections(rooms, search)}
                            columns={GroupSelectionCoulmns(selectedRooms, handleSelect)}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            getRowId={(row:IRoom)=>row._id}
                            // checkboxSelection
                            className='dark:bg-black dark:border dark:text-blue-800'
                            sx={{ border: 0 }}
                        />
                    </Paper>
                    }
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default SelectRoomsForGroups