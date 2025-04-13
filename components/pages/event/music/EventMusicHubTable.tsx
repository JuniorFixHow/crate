import { canPerformAction, musichubRoles } from "@/components/auth/permission/permission"
import AddButton from "@/components/features/AddButton"
import { useFetchEventMusicHubs, useFetchMusichub } from "@/hooks/fetch/useMusichub"
import { useAuth } from "@/hooks/useAuth"
import { IEvent } from "@/lib/database/models/event.model"
import { IMusichub } from "@/lib/database/models/musichub.model"
import { Paper } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import NewMusichub from "../../hubs/music/NewMusichub"
import EventMusichubInfoModal from "./EventMusicHubInfoModal"
import { EventMusicHubColumns } from "./EventMusicHubColumns"
import { LuCopyX } from "react-icons/lu"
import { CiCircleRemove } from "react-icons/ci"
import DeleteDialog from "@/components/DeleteDialog"
import { removeMusicHubFromEvent } from "@/lib/actions/musichub.action"
import AddMusicHubModal from "./AddMusicHubModal"

type EventMusicHubTableProps ={
    event:IEvent;
    canUpdate:boolean
}

const EventMusicHubTable = ({event, canUpdate}:EventMusicHubTableProps) => {
    const {user} = useAuth();

    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [selectMode, setSelectMode] = useState<boolean>(false);
    const [currentMusic, setCurrentMusic] = useState<IMusichub|null>(null);

    const [selection, setSelection] = useState<string[]>([]);


    const {refetch} = useFetchMusichub();
    const {musichubs, isPending, refetch:reload} = useFetchEventMusicHubs(event?._id);
    const reader = canPerformAction(user!, 'reader', {musichubRoles});
    const updater = canPerformAction(user!, 'updater', {musichubRoles});
    const creator = canPerformAction(user!, 'creator', {musichubRoles});


    const handleSelection =(id:string)=>{
        setSelection((prev)=>{
            const selected = prev.find((item)=>item===id);
            return selected ? prev.filter((item)=>item !== id)
            :
            [...prev, id]
        })
    }


    const handleNew = ()=>{
            setCurrentMusic(null);
            setNewMode(true);
        }
        const handleEdit = (data:IMusichub)=>{
            setCurrentMusic(data);
            setNewMode(true);
        }
        const handleInfo = (data:IMusichub)=>{
            setCurrentMusic(data);
            setInfoMode(true);
        }

        const handleDelete = ()=>{
            setDeleteMode(true);
        }
    
        const handleDeleteMusics = async()=>{
            try {
                if(selection.length){
                    const res = await removeMusicHubFromEvent(selection, event?._id);
                    reload();
                    enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                    setDeleteMode(false);
                    setSelection([]);
                }
            } catch (error) {
                console.log(error);
                enqueueSnackbar('Error occured unassigning musicians', {variant:'error'});
            }
        }
    
        const musicCounts = selection.length > 1 ? `${selection.length} musicians` : `${selection.length} musician`;
        const message = `You're about to remove ${musicCounts} from this event. Are you sure?`
        
        const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="table-main2" >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            
            {
                creator &&
                <AddButton type="button" onClick={handleNew} text="Add New" noIcon smallText className="rounded justify-center" />
            }
            {
                canUpdate &&
                <AddButton type="button" onClick={()=>setSelectMode(true)} text="Assign new musician" noIcon smallText className="rounded justify-center" />
            }
        </div>

        <EventMusichubInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentHub={currentMusic} setCurrentHub={setCurrentMusic} />
        <DeleteDialog onTap={handleDeleteMusics} title={`Remove music items`} value={deleteMode} setValue={setDeleteMode} message={message} />
        <AddMusicHubModal reload={reload} selectMode={selectMode} setSelectMode={setSelectMode} eventId={event?._id} />
        <NewMusichub
            infoMode={newMode}
            setInfoMode={setNewMode}
            currentHub={currentMusic}
            setCurrentHub={setCurrentMusic}
            updater={updater}
            refetch={refetch}
        />

        <div className="flex flex-col gap-4">
            {
                selection.length > 0 &&
                <div className="flex gap-4 items-center">
                    {
                        canUpdate &&
                        <div onClick={handleDelete}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                            <div className="flex-center p-1 bg-slate-400 rounded-full">
                                <CiCircleRemove />
                            </div>
                            <span className="dark:text-black text-sm" >Remove {`${musicCounts}`}</span>
                        </div>
                    }
                    <div onClick={()=>setSelection([])}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                        <div className="flex-center p-1 bg-slate-400 rounded-full">
                            <LuCopyX />
                        </div>
                        <span className="dark:text-black text-sm" >Cancel Selections</span>
                    </div>
                    
                </div>
            }
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    loading={isPending}
                    rows={musichubs}
                    columns={EventMusicHubColumns(handleInfo, handleEdit, updater, reader, selection, handleSelection)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                    getRowId={(row:IMusichub):string=>row._id}
                    slots={{
                        toolbar:GridToolbar
                    }}
                    slotProps={{
                        toolbar:{
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true
                            },
                            showQuickFilter:true
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

export default EventMusicHubTable