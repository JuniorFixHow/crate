'use client'
import DeleteDialog from "@/components/DeleteDialog";
import AddButton from "@/components/features/AddButton";
// import SearchBar from "@/components/features/SearchBar";
import { useFetchContracts } from "@/hooks/fetch/useContract";
import { IContract } from "@/lib/database/models/contract.model";
// import { ErrorProps } from "@/types/Types";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContractColumns } from "./ContractColumns";
import ContractInfoModal from "./ContractInfoModal";
import { useAuth } from "@/hooks/useAuth";
import { canPerformAction, contractRoles, serviceRoles } from "@/components/auth/permission/permission";
import { enqueueSnackbar } from "notistack";
import { deleteContract } from "@/lib/actions/contract.action";
import { useRouter } from "next/navigation";

const ContractTable = () => {
    const {user} = useAuth();
    const router = useRouter();
    // const [search, setSearch] = useState<string>('');
    // const [response, setResponse] = useState<ErrorProps>(null);
    const [currentContract, setCurrentContract] = useState<IContract|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const {contracts, loading, refetch} = useFetchContracts();

    const creator = canPerformAction(user!, 'creator', {contractRoles});
    const reader = canPerformAction(user!, 'reader', {contractRoles});
    const updater = canPerformAction(user!, 'updater', {contractRoles});
    const deleter = canPerformAction(user!, 'deleter', {contractRoles});
    const admin = canPerformAction(user!, 'admin', {contractRoles});
    const serviceReader = canPerformAction(user!, 'creator', {serviceRoles});

    useEffect(()=>{
      if(user && !admin){
        router.replace('/dashboard/forbidden?p=Contract Admin');
      }
    },[admin, user, router])

    const handleDeleteMode = (data:IContract)=>{
        setCurrentContract(data);
        setDeleteMode(true);
    }

    const handleInfoMode = (data:IContract)=>{
        setCurrentContract(data);
        setInfoMode(true);
    }

    const handleDeleteContract = async()=>{
      try {
        if(currentContract){
          const res = await deleteContract(currentContract?._id);
          enqueueSnackbar(res?.message, {variant: res?.error ? 'error':'success'});
          refetch();
          setDeleteMode(false);
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured deleting the contract');
      }
    }
    const paginationModel = { page: 0, pageSize: 10 };
    const message = `Deleting a contract will leave the associated church unlicensed. Proceed?`;

    if(!admin) return;

  return (
    <div className='table-main2' >
        <div className="flex flex-col gap-5 lg:flex-row items-start xl:items-end lg:justify-between w-full">
            <div className="flex flex-row gap-4  items-center  w-full justify-end">
                {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
                {
                  creator &&
                  <Link href={'/dashboard/churches/contracts/new'} >
                      <AddButton smallText text='New Contract' noIcon className='rounded' />
                  </Link>
                }
            </div>
        </div> 

        <ContractInfoModal reader={(reader || updater)} serviceReader={serviceReader} infoMode={infoMode} setInfoMode={setInfoMode} currentContract={currentContract} setCurrentContract={setCurrentContract} />
        <DeleteDialog onTap={handleDeleteContract} message={message} title={`Delete ${currentContract?.title}`} value={deleteMode} setValue={setDeleteMode} />

        {/* {
          response?.message &&
          <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        } */}
        <div className="flex w-full">
          <Paper className='w-full' sx={{ height: 'auto', }}>
              <DataGrid
                  getRowId={(row:IContract):string=> row?._id as string}
                  rows={contracts}
                  columns={ContractColumns(handleInfoMode, handleDeleteMode, reader, updater, deleter)}
                  initialState={{ pagination: { paginationModel } }}
                  loading={loading}
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
                  pageSizeOptions={[5, 10]}
                  // checkboxSelection
                  className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                  sx={{ border: 0 }}
              />
          </Paper>
        </div>
    </div>
  )
}

export default ContractTable