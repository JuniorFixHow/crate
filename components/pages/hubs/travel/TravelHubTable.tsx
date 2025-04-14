'use client'
import { canPerformAction, canPerformAdmin, churchRoles, travelhubRoles } from "@/components/auth/permission/permission";
// import { checkIfAdmin } from "@/components/Dummy/contants";
import AddButton from "@/components/features/AddButton";
import SearchSelectEventsV2 from "@/components/features/SearchSelectEventsV2";
import { useFetchSingleTraveller, useFetchTravelhubs } from "@/hooks/fetch/useTravelhub";
import { useAuth } from "@/hooks/useAuth";
import { deleteTravelHub } from "@/lib/actions/travel.action";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { ITravelhub } from "@/lib/database/models/travelhub.model";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SearchTravlhub } from "./fxn";
import { TravelhubColumns } from "./TravelhubColumns";
import DeleteDialog from "@/components/DeleteDialog";
import NewTravelhub from "./NewTravelhub";
import TravelhubInfoModal from "./TravelhubInfoModal";

const TravelHubTable = () => {

    const {user} = useAuth();
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    const [currentTravel, setCurrentTravel] = useState<ITravelhub|null>(null);
    const {travellers, isPending, refetch} = useFetchTravelhubs(eventId);
    const {traveller} = useFetchSingleTraveller();

    const router = useRouter();

    const isAdmin = canPerformAdmin(user!, 'reader', {churchRoles});
    
    const admin = canPerformAction(user!, 'admin', {travelhubRoles});
    const reader = canPerformAction(user!, 'reader', {travelhubRoles});
    const deleter = canPerformAction(user!, 'deleter', {travelhubRoles});
    const updater = canPerformAction(user!, 'updater', {travelhubRoles});
    const creator = canPerformAction(user!, 'creator', {travelhubRoles});

    const reg = currentTravel?.regId as IRegistration;
    const member = reg?.memberId as IMember;

    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Tavel Admin')
        }
    },[user, admin, router])

    useEffect(()=>{
        if(traveller){
            setCurrentTravel(traveller);
            setInfoMode(true);
        }
    },[traveller])
    
    const handleNew = ()=>{
        setCurrentTravel(null);
        setNewMode(true);
    }
    const handleEdit = (data:ITravelhub)=>{
        setCurrentTravel(data);
        setNewMode(true);
    }
    const handleInfo = (data:ITravelhub)=>{
        setCurrentTravel(data);
        setInfoMode(true);
    }
    const handleDelete = (data:ITravelhub)=>{
        setCurrentTravel(data);
        setDeleteMode(true);
    }
    
    const handleDeleteTravel = async()=>{
        try {
            if(currentTravel){
                const res = await deleteTravelHub(currentTravel?._id);
                refetch();
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting travel item', {variant:'error'});
        }
    }

    const message = `You're about to delete ${member?.name}'s travel information. Are you sure?`
    
    const paginationModel = { page: 0, pageSize: 10 };

    if(!admin) return;

  return (
    <div className="table-main2" >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchSelectEventsV2 setSelect={setEventId} />
            {
                creator &&
                <AddButton onClick={handleNew} text="Add New" noIcon smallText className="rounded justify-center self-end" />
            }
        </div>

        <TravelhubInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentHub={currentTravel} setCurrentHub={setCurrentTravel} />
        <DeleteDialog onTap={handleDeleteTravel} title={`Delete travel item`} value={deleteMode} setValue={setDeleteMode} message={message} />
        <NewTravelhub
            infoMode={newMode}
            setInfoMode={setNewMode}
            currentHub={currentTravel}
            setCurrentHub={setCurrentTravel}
            updater={updater}
            refetch={refetch}
        />

        <Paper className='w-full' sx={{ height: 'auto', }}>
            <DataGrid
                loading={isPending}
                rows={SearchTravlhub(travellers, eventId)}
                columns={TravelhubColumns(handleInfo, handleEdit,handleDelete, updater, reader, deleter,isAdmin)}
                initialState={{ 
                    pagination: { paginationModel },
                    columns:{
                        columnVisibilityModel:{
                            church:isAdmin,
                            notes:false
                        }
                    }
                }}
                pageSizeOptions={[5, 10, 20, 30, 50, 100]}
                getRowId={(row:ITravelhub):string=>row._id}
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

export default TravelHubTable