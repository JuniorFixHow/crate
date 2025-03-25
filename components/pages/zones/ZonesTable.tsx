"use client"
import AddButton from '@/components/features/AddButton';
// import SearchBar from '@/components/features/SearchBar'
import { Paper } from '@mui/material';
import React, { useEffect, useState } from 'react'
// import { SearchZone } from './fxn';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ZoneColumns } from './ZoneColumn';
import NewZone from './NewZone';
import DeleteDialog from '@/components/DeleteDialog';
import ZoneInfoModal from './ZoneInfoModal';
import { IZone } from '@/lib/database/models/zone.model';
import { useFetchZones } from '@/hooks/fetch/useZone';
import { deleteZone, getZone } from '@/lib/actions/zone.action';
// import { ErrorProps } from '@/types/Types';
import { useRouter, useSearchParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, churchRoles, isSuperUser, isSystemAdmin, zoneRoles } from '@/components/auth/permission/permission';

const ZonesTable = () => {
  const {user} = useAuth();
  const router = useRouter();
  // const [search, setSearch] = useState<string>('');
  const [currentZone, setCurrentZone] = useState<IZone|null>(null);
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [infoMode, setInfoMode] = useState<boolean>(false);
  const paginationModel = { page: 0, pageSize: 10 };
  // const [deleteState, setDeleteState]=useState<ErrorProps>({message:'', error:false});
  
  const creator = canPerformAction(user!, 'creator', {zoneRoles});
  const updater = canPerformAction(user!, 'updater', {zoneRoles});
  const reader = canPerformAction(user!, 'reader', {zoneRoles});
  const admin = canPerformAction(user!, 'admin', {zoneRoles});
  const deleter = isSuperUser(user!) || isSystemAdmin.deleter(user!);
  const churchReader = canPerformAction(user!, 'reader', {churchRoles});

  useEffect(()=>{
    if(user && !admin){
      router.replace('/dashboard/forbidden?p=Zone Admin');
    }
  },[admin, router, user])

  const {zones, loading, refetch} =  useFetchZones();
  const searchParams = useSearchParams();
  // console.log(zones)
  const handleZoneClick = (data:IZone)=>{
    setCurrentZone(data);
    setOpenNew(true);
  }

  const handleInfoClick = (data:IZone)=>{
    setCurrentZone(data);
    setInfoMode(true);
  }


    useEffect(() => {
        const fetchChurch = async () => {
          const data = searchParams?.get('id');
          if (data) {
            const church: IZone = await getZone(data); // Await the promise
            setCurrentZone(church);
            setInfoMode(true);
          }
        };
      
        fetchChurch(); // Call the async function
      }, [searchParams]);


  const message = `Deleting a zone will also delete its dependants such as churches and members. This is very critical and you're advised to rather delete the members or churches that are no longer required. Do you still want to delete this zone?`;
  const handleDeleteModal = (data:IZone)=>{
    setCurrentZone(data);
    setDeleteMode(true);
  }

  const handleOpenNew=()=>{
    setOpenNew(true);
    setCurrentZone(null);
  }

  const handleDeleteZone = async()=>{
    if(currentZone){
      try {
        const res = await deleteZone(currentZone._id);
        setDeleteMode(false);
        setCurrentZone(null);
        enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
        refetch();
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Error occured deleting zone', {variant:'error'});
      }
    }
  }

  if(!admin) return

  return (
    <div className='table-main2' >
      <div className="flex flex-row w-full gap-4 justify-end items-center px-4 pb-4">
        {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
        {
          creator &&
          <AddButton onClick={handleOpenNew} smallText text='Add Zone' noIcon className='rounded' />
        }
      </div>
      {/* {
        deleteState?.message &&
        <Alert onClose={()=>setDeleteState({message:'', error:false})}  className='text-center' severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
      } */}
      <NewZone updater={updater} refetch={refetch} openZone={openNew} setOpenZone={setOpenNew} currentZone={currentZone} setCurrentZone={setCurrentZone} />
      <ZoneInfoModal reader={churchReader} infoMode={infoMode} setInfoMode={setInfoMode} currentZone={currentZone} setCurrentZone={setCurrentZone} />
      <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentZone?.name}`} message={message} onTap={handleDeleteZone} />
      
      <div className="flex w-full">
        <Paper className='w-full' sx={{ height: 'auto', }}>
            <DataGrid
                getRowId={(row:IZone):string=>row?._id as string}
                rows={zones}
                loading={loading}
                columns={ZoneColumns(handleZoneClick, handleDeleteModal, handleInfoClick, reader, updater, deleter)}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 15, 20]}
                // checkboxSelection
                className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                sx={{ border: 0 }}
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
            />
        </Paper>
        
        </div>
    </div>
  )
}

export default ZonesTable
