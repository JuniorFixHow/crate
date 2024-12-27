'use client'
import AddButton from "@/components/features/AddButton";
import SearchBar from "@/components/features/SearchBar";
import { IService } from "@/lib/database/models/service.model";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";
import { ErrorProps } from "@/types/Types";
import { useSearchParams } from "next/navigation";
import { useFetchServices } from "@/hooks/fetch/useService";
import { deleteService, getService } from "@/lib/actions/service.action";
import { SearchServices } from "./fxn";
import { ServiceColumns } from "./ServiceColumns";
import NewService from "./NewService";
import ServiceInfoModal from "./ServiceInfoModal";

const ServicesTable = () => {
    const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentService, setCurrentService] = useState<IService|null>(null);
    const [editmode, setEditmode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const {services, loading} = useFetchServices();
    const searchParams = useSearchParams();

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
          setResponse({message:'Error occured fetching campuse data', error:true});
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
          setResponse(res);
        }
      } catch (error) {
        console.log(error);
        setResponse({message:'Error occured deleting campus.', error:true});
      }finally{
        setDeleteMode(false);
      }
    }

    const message = `You're about to delete a service. Proceed?`;
    const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded' >
        <div className="flex flex-row gap-4  items-center px-0  w-full justify-end">
            <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
            <AddButton onClick={handleOpenNew} smallText text='Add Service' noIcon className='rounded' />
        </div>

        <NewService infoMode={editmode} setInfoMode={setEditmode} setCurrentService={setCurrentService} currentService={currentService} />
        <ServiceInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentService={currentService} setCurrentService={setCurrentService} />
        <DeleteDialog onTap={handledeleteService} message={message} title={`Delete ${currentService?.name}`} value={deleteMode} setValue={setDeleteMode} />

        {
          response?.message &&
          <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }
        <div className="flex w-full">
          {
            loading ?
            <LinearProgress className='w-full' />
            :
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    getRowId={(row:IService):string=> row?._id as string}
                    rows={SearchServices(services, search)}
                    columns={ServiceColumns(handleInfoMode, handleEditMode, handleDeleteMode)}
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

export default ServicesTable