'use client'
import AddButton from "@/components/features/AddButton"
import { useFetchKeys } from "@/hooks/fetch/useKeys"
import { Alert, LinearProgress, Paper } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { SearchKey } from "./fxn"
import { useEffect, useState } from "react"
import { ErrorProps } from "@/types/Types"
import SearchBar from "@/components/features/SearchBar"
import { IKey } from "@/lib/database/models/key.model"
import DeleteDialog from "@/components/DeleteDialog"
import { KeyColumns } from "./KeyColumn"
import SearchSelectRooms from "@/components/features/SearchSelectRooms"
import NewKey from "./NewKey"
import { deleteKey, getKey } from "@/lib/actions/key.action"
import { useSearchParams } from "next/navigation"
import SearchSelectEvents from "@/components/features/SearchSelectEvents"

const KeysTable = () => {
    const [response, setResponse] = useState<ErrorProps>(null);
    const [roomId, setRoomId] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [currentKey, setCurrentKey] = useState<IKey|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const searchParams = useSearchParams();

    const {keys, loading} = useFetchKeys()
    // console.log(keys)

    // console.log('RoomId: ', roomId)

    useEffect(()=>{
        const id = searchParams.get('id');
        const fetchKey = async()=>{
            if(id){
                try {
                    const key = await getKey(id);
                    setCurrentKey(key);
                    setEditMode(true);
                } catch (error) {
                    console.log(error);
                    setResponse({message:'Error occured fetching key data', error:true})
                }
            }
        }
        fetchKey();
    },[searchParams])

    const handleDelete =(data:IKey)=>{
        setDeleteMode(true);
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
        setResponse(null);
        try {
            if(currentKey){
                const res = await deleteKey(currentKey._id);
                setResponse(res);
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured deleting key', error:true})
        }
    }

    const message = `You're about to delete this key. Are you sure?`

    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className="flex flex-col p-5 rounded gap-4 bg-white dark:bg-transparent dark:border" >
        <div className="flex w-full justify-between">
            <div className="flex items-end gap-4">
                <SearchSelectEvents setSelect={setEventId} isGeneric />
                <SearchSelectRooms eventId={eventId} isGeneric setSelect={setRoomId} />
            </div>
            <div className="flex items-end gap-4">
                <SearchBar setSearch={setSearch} reversed={false} />
                <AddButton onClick={handleNew} text="Add Key"  noIcon smallText className="rounded" type="button" />
            </div>
        </div>
    <NewKey editMode={editMode} setEditMode={setEditMode} currentKey={currentKey} setCurrentKey={setCurrentKey} />
    <DeleteDialog message={message} onTap={handleDeleteKey} title={`Remove ${currentKey?.code}`} value={deleteMode} setValue={setDeleteMode} />
    {/* <DeleteDialog message={deleteMessae} onTap={deleteRoom} title={`Remove all groups`} value={deleteMode} setValue={setDeleteMode} /> */}
    
    {
        response?.message &&
        <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
    }
    <div className="flex w-full">
        {
            loading ? 
            <LinearProgress className="w-full" />
            :
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={SearchKey(keys, search, roomId, eventId)}
                    getRowId={(row:IKey)=>row._id}
                    columns={KeyColumns(handleDelete, handleEdit)}
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

export default KeysTable