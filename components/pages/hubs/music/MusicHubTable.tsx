'use client'
import { canPerformAction, musichubRoles } from "@/components/auth/permission/permission";
import AddButton from "@/components/features/AddButton";
import SearchSelectChurchesV3 from "@/components/features/SearchSelectChurchesV3";
import { useFetchMusichub, useFetchSingleMusichub } from "@/hooks/fetch/useMusichub";
import { useAuth } from "@/hooks/useAuth";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchMusicHubs } from "./fxn";
import { IMusichub } from "@/lib/database/models/musichub.model";
import { MusicHubColumns } from "./MusicHubColumns";
import DeleteDialog from "@/components/DeleteDialog";
import { enqueueSnackbar } from "notistack";
import { deleteMusicHub } from "@/lib/actions/musichub.action";
import { checkIfAdmin } from "@/components/Dummy/contants";
import NewMusichub from "./NewMusichub";
import MusichubInfoModal from "./MusichubInfoModal";

const MusicHubTable = () => {
    const {user} = useAuth();
    const [churchId, setChurchId] = useState<string>(''); 
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [currentMusic, setCurrentMusic] = useState<IMusichub|null>(null);
    const {musics, isPending, refetch} = useFetchMusichub();
    const {music} = useFetchSingleMusichub();

    const router = useRouter();

    const isAdmin = checkIfAdmin(user);

    const admin = canPerformAction(user!, 'admin', {musichubRoles});
    const reader = canPerformAction(user!, 'reader', {musichubRoles});
    const deleter = canPerformAction(user!, 'deleter', {musichubRoles});
    const updater = canPerformAction(user!, 'updater', {musichubRoles});
    const creator = canPerformAction(user!, 'creator', {musichubRoles});

    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Tavel Admin')
        }
    },[user, admin, router])

    useEffect(()=>{
        if(music){
            setCurrentMusic(music);
            setInfoMode(true);
        }
    },[music])

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
    const handleDelete = (data:IMusichub)=>{
        setCurrentMusic(data);
        setDeleteMode(true);
    }

    const handleDeleteMusic = async()=>{
        try {
            if(currentMusic){
                const res = await deleteMusicHub(currentMusic?._id);
                refetch();
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting music item', {variant:'error'});
        }
    }

    const message = `You're about to delete ${currentMusic?.title}. Are you sure?`
    
    const paginationModel = { page: 0, pageSize: 10 };

    if(!admin) return;
  return (
    <div className="table-main2" >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {
                isAdmin &&
                <SearchSelectChurchesV3 setSelect={setChurchId} />
            }
            {
                creator &&
                <AddButton onClick={handleNew} text="Add New" noIcon smallText className="rounded justify-end self-end" />
            }
        </div>

        <MusichubInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentHub={currentMusic} setCurrentHub={setCurrentMusic} />
        <DeleteDialog onTap={handleDeleteMusic} title={`Delete music item`} value={deleteMode} setValue={setDeleteMode} message={message} />
        <NewMusichub
            infoMode={newMode}
            setInfoMode={setNewMode}
            currentHub={currentMusic}
            setCurrentHub={setCurrentMusic}
            updater={updater}
            refetch={refetch}
        />

        <Paper className='w-full' sx={{ height: 'auto', }}>
            <DataGrid
                loading={isPending}
                rows={SearchMusicHubs(musics, churchId)}
                columns={MusicHubColumns(handleInfo, handleEdit,handleDelete, updater, reader, deleter)}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20, 30, 50, 100]}
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
  )
}

export default MusicHubTable