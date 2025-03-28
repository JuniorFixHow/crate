'use client'
import AddButton from "@/components/features/AddButton"
import { useFetchKeys } from "@/hooks/fetch/useKeys"
import { Paper } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { SearchKey } from "./fxn"
import { useEffect, useState } from "react"
// import { ErrorProps } from "@/types/Types"
// import SearchBar from "@/components/features/SearchBar"
import { IKey } from "@/lib/database/models/key.model"
import DeleteDialog from "@/components/DeleteDialog"
import { KeyColumns } from "./KeyColumn"
// import SearchSelectRooms from "@/components/features/SearchSelectRooms"
import NewKey from "./NewKey"
import { deleteKey, getKey } from "@/lib/actions/key.action"
import { useRouter, useSearchParams } from "next/navigation"
// import SearchSelectEvents from "@/components/features/SearchSelectEvents"
import KeyInfoModal from "./KeyInfoModal"
import SearchSelectEventsV4 from "@/components/features/SearchSelectEventsV4"
import SearchSelectRoomsV2 from "@/components/features/SearchSelectRoomsV2"
import { enqueueSnackbar } from "notistack"
import { useAuth } from "@/hooks/useAuth"
import { canPerformAction, canPerformEvent, eventOrganizerRoles, isChurchAdmin, isSuperUser, isSystemAdmin, keyRoles, keyRolesExtended, memberRoles, roomRoles } from "@/components/auth/permission/permission"

const KeysTable = () => {
    const {user} = useAuth();
    const router = useRouter();
    const [roomId, setRoomId] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    // const [search, setSearch] = useState<string>('');
    const [currentKey, setCurrentKey] = useState<IKey|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const searchParams = useSearchParams();

    const {keys, loading, refetch} = useFetchKeys();

    const orgCreator = canPerformEvent(user!, 'creator', {eventOrganizerRoles});
    const orgUpdater = canPerformEvent(user!, 'updater', {eventOrganizerRoles});
    const orgReader = canPerformEvent(user!, 'reader', {eventOrganizerRoles});
    const orgDeleter = canPerformEvent(user!, 'deleter', {eventOrganizerRoles});
    const orgAdmin = canPerformEvent(user!, 'deleter', {eventOrganizerRoles});

    const creator = canPerformAction(user!, 'creator', {keyRoles}) || orgCreator;
    const updater = canPerformAction(user!, 'updater', {keyRoles}) || orgUpdater;
    const reader = canPerformAction(user!, 'reader', {keyRoles}) || orgReader;
    const deleter = canPerformAction(user!, 'deleter', {keyRoles}) || orgDeleter;
    const admin = canPerformAction(user!, 'admin', {keyRoles}) || orgAdmin;
    const roomReader = canPerformAction(user!, 'reader', {roomRoles}) || orgReader;
    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const assign = isSuperUser(user!) || isSystemAdmin.creator(user!) || isChurchAdmin.creator(user!) || keyRolesExtended.assign(user!) || orgUpdater;


    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Key Admin');
        }
    },[admin, user, router])

    useEffect(()=>{
        const id = searchParams.get('id');
        const fetchKey = async()=>{
            if(id){
                try {
                    const key = await getKey(id);
                    setCurrentKey(key);
                    setInfoMode(true);
                } catch (error) {
                    console.log(error);
                    enqueueSnackbar('Error occured fetching key data', {variant:'error'});
                }
            }
        }
        fetchKey();
    },[searchParams])

    const handleDelete =(data:IKey)=>{
        setDeleteMode(true);
        setCurrentKey(data);
    }

    const handleInfo =(data:IKey)=>{
        setInfoMode(true);
        setCurrentKey(data);
    }

    const handleEdit = (data:IKey)=>{
        setCurrentKey(data);
        setEditMode(true);
    }

    const handleNew = ()=>{
        setEditMode(true);
        setDeleteMode(false);
        setCurrentKey(null);
    }

    const handleDeleteKey = async()=>{
        // setResponse(null);
        try {
            if(currentKey){
                const res = await deleteKey(currentKey._id);
                // setResponse(res);
                setDeleteMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting key', {variant:'error'});
        }
    }

    const message = `You're about to delete this key. Are you sure?`

    const paginationModel = { page: 0, pageSize: 10 };

    if(!admin) return;
  return (
    <div className="table-main2" >
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center flex-col md:flex-row gap-4">
                <SearchSelectEventsV4 setSelect={setEventId} />
                <SearchSelectRoomsV2 eventId={eventId} setSelect={setRoomId} />
            </div>
            <div className="flex items-end gap-4">
                {
                    creator &&
                    <AddButton onClick={handleNew} text="Add Key"  noIcon smallText className="rounded w-[16rem] py-2 flex-center md:w-fit md:py-1" type="button" />
                }
            </div>
        </div>
    <NewKey assign={assign} updater={updater} editMode={editMode} setEditMode={setEditMode} currentKey={currentKey} setCurrentKey={setCurrentKey} />
    <DeleteDialog message={message} onTap={handleDeleteKey} title={`Remove ${currentKey?.code}`} value={deleteMode} setValue={setDeleteMode} />
    <KeyInfoModal setCurrentKey={setCurrentKey} infoMode={infoMode} currentKey={currentKey} setInfoMode={setInfoMode} />
    
    {/* {
        response?.message &&
        <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
    } */}
    <div className="flex w-full">
        <Paper className='w-full' sx={{ height: 'auto', }}>
            <DataGrid
                rows={SearchKey(keys,  roomId, eventId)}
                getRowId={(row:IKey)=>row._id}
                columns={KeyColumns(handleDelete, handleEdit, handleInfo, reader, updater, deleter, roomReader, showMember)}
                initialState={{ pagination: { paginationModel } }}
                loading={loading}
                pageSizeOptions={[5, 10, 15, 20, 30, 50, 10]}
                slots={{toolbar:GridToolbar}}
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

export default KeysTable