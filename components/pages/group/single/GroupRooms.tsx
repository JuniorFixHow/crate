import DeleteDialog from "@/components/DeleteDialog"
import AddButton from "@/components/features/AddButton"
import { useFetchRoomsForGroup } from "@/hooks/fetch/useGroups"
import { IGroup } from "@/lib/database/models/group.model"
import { IRoom } from "@/lib/database/models/room.model"
import { Alert, LinearProgress, Paper } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useState } from "react"
import { SingleGrpRoomColumns } from "./SingleGrpRoomColumns"
import { ErrorProps } from "@/types/Types"
import { removeGroupFromAllRooms, removeGroupFromRoom } from "@/lib/actions/room.action"

type GroupRoomsProps = {
    currentGroup:IGroup|null
}

const GroupRooms = ({currentGroup}:GroupRoomsProps) => {
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [removeMode, setRemoveMode] = useState<boolean>(false);
    const [currentRoom, setCurrentRoom] = useState<IRoom|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);

    const [deleteLoading, setDeleteLoading] = useState<boolean>()

    const {groupRooms, loading} = useFetchRoomsForGroup(currentGroup ? currentGroup._id:'')

    const paginationModel = { page: 0, pageSize: 10 };
    const removeMessae = `You're about to remove this room from the group. Continue?`
    const deleteMessae = `You're about to remove all groups assoiciated with this group. Continue?`;

    const handleRemove = async(data:IRoom)=>{
        setRemoveMode(true);
        setCurrentRoom(data);
    }

    const removeRoom = async()=>{
        try {
            if(currentGroup && currentRoom){
                const res = await removeGroupFromRoom(currentRoom._id, currentGroup._id)
                setResponse({message:'Room removed successfully', error:false});
                setResponse(res);
                setRemoveMode(false);  
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured removing room', error:true});
        }
    }

    const deleteRoom = async()=>{
        try {
            setDeleteLoading(true);
            if(currentGroup){
                const res = await removeGroupFromAllRooms(currentGroup?._id);
                setResponse(res);
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured removing rooms.', error:true})
        }finally{
            setDeleteLoading(false);
        }
    }

    const handleShowDelete = () =>{
        setDeleteMode(true);
        setCurrentRoom(null);
    }

    // console.log(currentGroup?.roomIds)

  return (
    <div className="flex flex-col p-5 rounded gap-4 bg-white dark:bg-transparent dark:border" >
        <div className="flex w-full justify-end gap-4">
            <AddButton onClick={handleShowDelete} disabled={deleteLoading} text={deleteLoading ? 'loading...' : (currentGroup?.roomIds && currentGroup?.roomIds?.length > 1) ? "Remove Rooms":'Remove Room'} noIcon isCancel smallText className="rounded" type="button" />
        </div>

        <DeleteDialog message={removeMessae} onTap={removeRoom} title={`Remove ${currentRoom?.venue} ${currentRoom?.number}`} value={removeMode} setValue={setRemoveMode} />
        <DeleteDialog message={deleteMessae} onTap={deleteRoom} title={`Remove all groups`} value={deleteMode} setValue={setDeleteMode} />
        
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
                        rows={groupRooms}
                        getRowId={(row:IRoom)=>row._id}
                        columns={SingleGrpRoomColumns(handleRemove)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
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

export default GroupRooms