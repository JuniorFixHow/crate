import DeleteDialog from "@/components/DeleteDialog"
import AddButton from "@/components/features/AddButton"
import { useFetchRoomsForGroup } from "@/hooks/fetch/useGroups"
import { IGroup } from "@/lib/database/models/group.model"
import { IRoom } from "@/lib/database/models/room.model"
import { Alert,  Paper } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useState } from "react"
import { SingleGrpRoomColumns } from "./SingleGrpRoomColumns"
import { ErrorProps } from "@/types/Types"
import { removeGroupFromAllRooms, removeGroupFromRoom } from "@/lib/actions/room.action"
import { IVenue } from "@/lib/database/models/venue.model"
import { enqueueSnackbar } from "notistack"
import { SessionPayload } from "@/lib/session"
import { canPerformAction, facilityRoles, roomRoles, venueRoles } from "@/components/auth/permission/permission"

type GroupRoomsProps = {
    currentGroup:IGroup;
    roomAssign:boolean;
    user:SessionPayload;
}

const GroupRooms = ({currentGroup, user, roomAssign}:GroupRoomsProps) => {
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [removeMode, setRemoveMode] = useState<boolean>(false);
    const [currentRoom, setCurrentRoom] = useState<IRoom|null>(null);
    const [response, setResponse] = useState<ErrorProps>(null);

    const venueReader = canPerformAction(user!, 'reader', {venueRoles});
    const roomReader = canPerformAction(user!, 'reader', {roomRoles});
    const facReader = canPerformAction(user!, 'reader', {facilityRoles});

    const [deleteLoading, setDeleteLoading] = useState<boolean>()
    const [removeLoading, setRemoveLoading] = useState<boolean>()

    const {groupRooms, loading, refetch} = useFetchRoomsForGroup(currentGroup?._id);

    const paginationModel = { page: 0, pageSize: 10 };
    const removeMessae = `You're about to remove this room from the group. Continue?`
    const deleteMessae = `You're about to remove all groups assoiciated with this group. Continue?`;

    const handleRemove = async(data:IRoom)=>{
        setRemoveMode(true);
        setCurrentRoom(data);
    }

    const removeRoom = async()=>{
        try {
            setRemoveLoading(true);
            if(currentGroup && currentRoom){
                const res = await removeGroupFromRoom(currentRoom._id, currentGroup._id);
                enqueueSnackbar(res?.message, {variant: res?.error ? 'error':'success'});
                setRemoveMode(false);
                refetch();  
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('An unknown error occured removing group from room', {variant:'error'});
        }finally{
            setRemoveLoading(false);
        }
    }

    const deleteRoom = async()=>{
        try {
            setDeleteLoading(true);
            if(currentGroup){
                const res = await removeGroupFromAllRooms(currentGroup?._id);
                enqueueSnackbar(res?.message, {variant: res?.error ? 'error':'success'});
                setDeleteMode(false);
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing rooms', {variant:'error'});
        }finally{
            setDeleteLoading(false);
        }
    }

    const handleShowDelete = () =>{
        setDeleteMode(true);
        setCurrentRoom(null);
    }

    const venue = currentRoom?.venueId as IVenue;

    // console.log(currentGroup?.roomIds)

  return (
    <div className="flex flex-col p-5 rounded gap-4 bg-white dark:bg-transparent dark:border" >
        {
            roomAssign &&
            <div className="flex w-full justify-end gap-4">
                <AddButton onClick={handleShowDelete} disabled={deleteLoading} text={deleteLoading ? 'loading...' : (currentGroup?.roomIds && currentGroup?.roomIds?.length > 1) ? "Remove Rooms":'Remove Room'} noIcon isCancel smallText className="rounded" type="button" />
            </div>
        }

        <DeleteDialog loading={removeLoading} message={removeMessae} onTap={removeRoom} title={`Remove ${venue?.name} ${currentRoom?.number}`} value={removeMode} setValue={setRemoveMode} />
        <DeleteDialog loading={deleteLoading} message={deleteMessae} onTap={deleteRoom} title={`Remove all groups`} value={deleteMode} setValue={setDeleteMode} />
        
        {
            response?.message &&
            <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
        }

        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    rows={groupRooms}
                    getRowId={(row:IRoom)=>row._id}
                    loading={loading}
                    columns={SingleGrpRoomColumns(handleRemove, venueReader, facReader, roomReader, roomAssign)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20, 30, 50, 100]}
                    slots={{toolbar:GridToolbar}}
                    slotProps={{
                        toolbar:{
                            showQuickFilter:true,
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true,
                            }
                        }
                    }}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    </div>
  )
}

export default GroupRooms