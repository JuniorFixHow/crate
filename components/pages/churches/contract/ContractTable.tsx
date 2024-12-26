'use client'
import DeleteDialog from "@/components/DeleteDialog";
import AddButton from "@/components/features/AddButton";
import SearchBar from "@/components/features/SearchBar";
import { useFetchContracts } from "@/hooks/fetch/useContract";
import { IContract } from "@/lib/database/models/contract.model";
import { ErrorProps } from "@/types/Types";
import { Alert, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useState } from "react";
import { ContractColumns } from "./ContractColumns";
import { searchContract } from "@/functions/search";
import ContractInfoModal from "./ContractInfoModal";

const ContractTable = () => {

    const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentContract, setCurrentContract] = useState<IContract|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const {contracts, loading} = useFetchContracts();

    const handleDeleteMode = (data:IContract)=>{
        setCurrentContract(data);
        setDeleteMode(true);
    }

    const handleInfoMode = (data:IContract)=>{
        setCurrentContract(data);
        setInfoMode(true);
    }

    const deleteContract = async()=>{

    }
    const paginationModel = { page: 0, pageSize: 10 };
    const message = `Deleting a contract will leave the associated church unlicensed. Proceed?`;
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded' >
        <div className="flex flex-col gap-5 lg:flex-row items-start xl:items-end lg:justify-between w-full">
            <div className="flex flex-row gap-4  items-center  w-full justify-end">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <Link href={'/dashboard/churches/contracts/new'} >
                    <AddButton smallText text='New Contract' noIcon className='rounded' />
                </Link>
            </div>
        </div> 

        <ContractInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentContract={currentContract} setCurrentContract={setCurrentContract} />
        <DeleteDialog onTap={deleteContract} message={message} title={`Delete ${currentContract?.title}`} value={deleteMode} setValue={setDeleteMode} />

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
                    getRowId={(row:IContract):string=> row?._id as string}
                    rows={searchContract(search, contracts)}
                    columns={ContractColumns(handleInfoMode, handleDeleteMode)}
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

export default ContractTable