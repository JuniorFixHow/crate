'use client'
import React, { useEffect, useState } from 'react'
// import SearchBar from '@/components/features/SearchBar'
import AddButton from '@/components/features/AddButton'
import {  SearchVendorV2 } from './fxn'
import { VendorsColumns } from './VendorColumns'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Alert,  Paper } from '@mui/material'
import '../../../components/features/customscroll.css'
import VendorInfoModal from './VendorInfoModal'
import DeleteDialog from '@/components/DeleteDialog'
import NewVendor from './NewVendor'
import { IVendor } from '@/lib/database/models/vendor.model'
import { useFetchVendors } from '@/hooks/fetch/useVendor'
import { useFetchChurches } from '@/hooks/fetch/useChurch'
import { ErrorProps } from '@/types/Types'
import { deleteVendor, getVendor } from '@/lib/actions/vendor.action'
import { useRouter, useSearchParams } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import SearchSelectChurchesV2 from '@/components/features/SearchSelectChurchesV2'
import { deleteUserCompletely } from '@/lib/firebase/auth'

const VendorsTable = () => {
    const [church, setChurch] = useState<string>('');
    // const [search, setSearch] = useState<string>('');
    const [currentVendor, setCurrentVendor] = useState<IVendor|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [noChurch, setNoChurch] = useState<boolean>(false);
    const [deleteState, setDeleteState]=useState<ErrorProps>({message:'', error:false});
    const {vendors,  loading, refetch} = useFetchVendors();
    const {churches} = useFetchChurches();

    const searchParams = useSearchParams();

    const hadndleInfo = (data:IVendor)=>{
        setCurrentVendor(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:IVendor)=>{
        setCurrentVendor(data);
        setDeleteMode(true);
    }
    const hadndleNew = (data:IVendor)=>{
        setCurrentVendor(data);
        setNewMode(true);
    }

    const paginationModel = { page: 0, pageSize: 10 };

    const message = `Are you sure you want to delete this user?`

    const router = useRouter();
    const handleOpenNew = ()=>{
        if(churches.length <= 0){
         setNoChurch(true);
        }else{
         setCurrentVendor(null);
         setNewMode(true);
        }
     }
    const handleDeleteVendor = async()=>{
        setDeleteState({message:'', error:false})
        if(currentVendor){
          try {
            await deleteUserCompletely(currentVendor?._id);
            const res = await deleteVendor(currentVendor._id);
            setDeleteMode(false);
            setCurrentVendor(null);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            router.refresh();
            refetch()
          } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting user', {variant:'error'});
          }
        }
      }

      useEffect(()=>{
        const id = searchParams.get('id');
        const fetchVendor = async()=>{
            try {
                if(id){
                    const res = await getVendor(id);
                    setCurrentVendor(res);
                    setInfoMode(true);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchVendor();

      },[searchParams])


  return (
    <div className='table-main2' >
        <div className="flex flex-col gap-3 md:flex-row md:justify-between items-center">
            <SearchSelectChurchesV2 setSelect={setChurch} />
            <div className="flex flex-col items-center gap-2 w-full md:w-fit">
                {/* <SearchBar reversed={false} setSearch={setSearch} /> */}
                <AddButton onClick={handleOpenNew} noIcon text='Add User' smallText className='rounded w-[16rem] py-2 flex-center md:w-fit md:py-1' />
            </div>
        </div>
        {
            deleteState?.message &&
            <Alert onClick={()=>setDeleteState(null)} severity={deleteState.error?'error':'success'} >{deleteState.message}</Alert>
        }
        {
            noChurch &&
            <Alert severity='error' >There is no church to select for a vendor. Please, create a church first.</Alert>
        }
        <DeleteDialog onTap={handleDeleteVendor} message={message} title={`Delete ${currentVendor?.name}`} value={deleteMode} setValue={setDeleteMode} />
        <VendorInfoModal refetch={refetch} infoMode={infoMode} setInfoMode={setInfoMode} currentVendor={currentVendor} setCurrentVendor={setCurrentVendor} />

        <NewVendor openVendor={newMode} setOpenVendor={setNewMode} currentVendor={currentVendor} setCurrentVendor={setCurrentVendor} />

        <div className="flex">
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    getRowId={(row:IVendor):string=>row?._id}
                    rows={SearchVendorV2(vendors,  church)}
                    columns={VendorsColumns(hadndleInfo, hadndleDelete, hadndleNew)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15, 20, 30]}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800 scrollbar-custom'
                    sx={{ border: 0 }}
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
                />
            </Paper>
        </div>

    </div>
  )
}

export default VendorsTable