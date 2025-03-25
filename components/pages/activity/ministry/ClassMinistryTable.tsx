'use client'

import DeleteDialog from "@/components/DeleteDialog";
import AddButton from "@/components/features/AddButton";
// import SearchBar from "@/components/features/SearchBar";
import { ErrorProps, IClassMinistryExtended } from "@/types/Types";
import { Alert,  Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react"
import { SearchClassministry } from "./fxn";
import { ClassMinistryColumns } from "./ClassMinistryColumns";
import { deleteClassministry } from "@/lib/actions/classministry.action";
import { enqueueSnackbar } from "notistack";
import { useFetchClassministry } from "@/hooks/fetch/useClassministry";
import NewClassMinistry from "./NewClassMinistry";
import SearchSelectChurchesV3 from "@/components/features/SearchSelectChurchesV3";
import { useAuth } from "@/hooks/useAuth";
import { canPerformAction, isSuperUser, isSystemAdmin, ministryRoles } from "@/components/auth/permission/permission";
import { useRouter } from "next/navigation";

const ClassMinistryTable = () => {
    const {user} = useAuth();
    // const [search, setSearch] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentMinistry, setCurrentMinistry] = useState<IClassMinistryExtended|null>(null);

    const {classMinistries, isPending, refetch} = useFetchClassministry();

    const tableRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const creator = canPerformAction(user!, 'creator', {ministryRoles});
    const reader = canPerformAction(user!, 'reader', {ministryRoles});
    const updater = canPerformAction(user!, 'updater', {ministryRoles});
    const deleter = canPerformAction(user!, 'deleter', {ministryRoles});
    const admin = canPerformAction(user!, 'admin', {ministryRoles});
    const isAdmin = isSuperUser(user!) || isSystemAdmin.reader(user!)

    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Mininstry Admin')
        }
    },[user, admin, router])

    const handleNewMode = ()=>{
        setNewMode(true);
        setCurrentMinistry(null);
    }

    const handleDeleteMode = (data:IClassMinistryExtended)=>{
        setDeleteMode(true);
        setCurrentMinistry(data);
    }

    const handleEditMode = (data:IClassMinistryExtended)=>{
        setNewMode(true);
        setCurrentMinistry(data);
    }

    const handleDeleteMinistry = async()=>{
        try {
            if(currentMinistry){
                const response = await deleteClassministry(currentMinistry._id);
                enqueueSnackbar(response?.message, {variant:'success'});
                setDeleteMode(false);
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting ministry', {variant:'error'})
        }
    }

    const message = `Deleting the entire ministy will also delete its activities and attendance records.`

    const paginationModel = { page: 0, pageSize: 10 };
    
  return (
    <div ref={tableRef}  className="table-main2" >
        <div className="flex flex-col gap-5 md:flex-row w-full justify-between">
            <div className="flex items-end gap-4">
                {
                    isAdmin &&
                    <SearchSelectChurchesV3 setSelect={setChurchId} />
                }
            </div>
            <div className="flex items-end gap-4">
                {/* <SearchBar setSearch={setSearch} reversed={false} /> */}
                {
                    !newMode && creator &&
                    <AddButton text="Create Ministry" onClick={handleNewMode} noIcon smallText className="rounded" type="button" />
                }
            </div>
        </div>
        <NewClassMinistry
            newMode={newMode}
            setNewMode={setNewMode}
            currentClassministry={currentMinistry!}
            inputRef={tableRef}
            updater={updater}
            refetch={refetch}
        />
        <DeleteDialog message={message} onTap={handleDeleteMinistry} title={`Remove ${currentMinistry?.title}`} value={deleteMode} setValue={setDeleteMode} />
        {/* <ActivityInfoModal setCurrentActivity={setCurrentActivity} infoMode={infoMode} currentActivity={currentActivity} setInfoMode={setInfoMode} />
        <NewActivityDown newMode={newMode} setNewMode={setNewMode} activity={currentActivity} /> */}
        {
            response?.message &&
            <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }
        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    rows={SearchClassministry(classMinistries, churchId)}
                    getRowId={(row:IClassMinistryExtended)=>row._id}
                    columns={ClassMinistryColumns(handleDeleteMode,  handleEditMode, reader, updater, deleter)}
                    initialState={{ pagination: { paginationModel } }}
                    loading={isPending}
                    slots={{toolbar:GridToolbar}}
                    slotProps={{
                        toolbar:{
                            showQuickFilter:true,
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true
                            }
                        }
                    }}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
</div>
  )
}

export default ClassMinistryTable