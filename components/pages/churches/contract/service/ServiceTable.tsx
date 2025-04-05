'use client'
import AddButton from "@/components/features/AddButton";
// import SearchBar from "@/components/features/SearchBar";
import { IService } from "@/lib/database/models/service.model";
import { Alert,  Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";
import { ErrorProps } from "@/types/Types";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetchServices } from "@/hooks/fetch/useService";
import { deleteService, getService } from "@/lib/actions/service.action";
// import { SearchServices } from "./fxn";
import { ServiceColumns } from "./ServiceColumns";
import NewService from "./NewService";
import ServiceInfoModal from "./ServiceInfoModal";
import { useAuth } from "@/hooks/useAuth";
import { enqueueSnackbar } from "notistack";
import { canPerformAdmin, contractRoles, serviceRoles } from "@/components/auth/permission/permission";

const ServicesTable = () => {
    const {user} = useAuth();
    const router = useRouter();
    // const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentService, setCurrentService] = useState<IService|null>(null);
    const [editmode, setEditmode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const {services, loading, refetch} = useFetchServices();
    const searchParams = useSearchParams();

    const creator = canPerformAdmin(user!, 'creator', {serviceRoles});
    const reader = canPerformAdmin(user!, 'reader', {serviceRoles});
    const deleter = canPerformAdmin(user!, 'deleter', {serviceRoles});
    const updater = canPerformAdmin(user!, 'updater', {serviceRoles});
    const admin = canPerformAdmin(user!, 'admin', {serviceRoles});
    const showContracts = canPerformAdmin(user!, 'reader', {contractRoles});

    useEffect(()=>{
      if(user && !admin){
        router.replace('/dashboard/forbidden?p=Service Admin');
      }
    },[admin, user, router])

    useEffect(()=>{
      const id = searchParams.get('id');
      const fetchServic = async()=>{
        try {
          if(id){
            const camous = await getService(id) as IService;
            setCurrentService(camous);
            setInfoMode(true);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar('Error occured fetching campuse data', {variant:'error'});
        }
      }
      fetchServic();
    },[searchParams])

    const handleOpenNew = ()=>{
        setCurrentService(null);
        setEditmode(true);
    }

    const handleEditMode = (data:IService)=>{
        setCurrentService(data);
        setEditmode(true);
    }

    const handleDeleteMode = (data:IService)=>{
        setCurrentService(data);
        setDeleteMode(true);
    }

    const handleInfoMode = (data:IService)=>{
        setCurrentService(data);
        setInfoMode(true);
    }

    const handledeleteService = async() =>{
      try {
        if(currentService){
          const res = await deleteService(currentService._id);
          enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
          // setDeleteMode(false);
          refetch();
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured deleting service', {variant:'error'})
      }finally{
        setDeleteMode(false);
      }
    }

    const message = `You're about to delete a service. Proceed?`;
    const paginationModel = { page: 0, pageSize: 10 };

    if(!admin) return;

  return (
    <div className='table-main2' >
        <div className="flex flex-row gap-4  items-center px-0  w-full justify-end">
            {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
            {
              creator &&
              <AddButton onClick={handleOpenNew} smallText text='Add Service' noIcon className='rounded' />
            }
        </div>

        <NewService updater={updater} infoMode={editmode} setInfoMode={setEditmode} setCurrentService={setCurrentService} currentService={currentService} />
        <ServiceInfoModal showContracts={showContracts} infoMode={infoMode} setInfoMode={setInfoMode} currentService={currentService} setCurrentService={setCurrentService} />
        <DeleteDialog onTap={handledeleteService} message={message} title={`Delete ${currentService?.name}`} value={deleteMode} setValue={setDeleteMode} />

        {
          response?.message &&
          <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }
        <div className="flex w-full">
          <Paper className='w-full' sx={{ height: 'auto', }}>
              <DataGrid
                  getRowId={(row:IService):string=> row?._id as string}
                  rows={services}
                  columns={ServiceColumns(handleInfoMode, handleEditMode, handleDeleteMode, reader, updater, deleter)}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10, 15, 20, 30]}
                  loading={(admin && loading)}
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
                  // checkboxSelection
                  className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                  sx={{ border: 0 }}
              />
          </Paper>
        </div>
    </div>
  )
}

export default ServicesTable