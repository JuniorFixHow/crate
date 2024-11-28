'use client'
import React, { useState } from 'react'
import SearchBar from '@/components/features/SearchBar'
import AddButton from '@/components/features/AddButton'
import { SearchVendor } from './fxn'
import { VendorsColumns } from './VendorColumns'
import { DataGrid } from '@mui/x-data-grid'
import { Alert, Paper } from '@mui/material'
import '../../../components/features/customscroll.css'
import VendorInfoModal from './VendorInfoModal'
import DeleteDialog from '@/components/DeleteDialog'
import NewVendor from './NewVendor'
import { IVendor } from '@/lib/database/models/vendor.model'
import { useFetchVendors } from '@/hooks/fetch/useVendor'
import SearchSelectChurch from '@/components/shared/SearchSelectChurch'
import { useFetchChurches } from '@/hooks/fetch/useChurch'
import { ErrorProps } from '@/types/Types'
import CircularIndeterminate from '@/components/misc/CircularProgress'
import { deleteVendor } from '@/lib/actions/vendor.action'
import { useRouter } from 'next/navigation'

const VendorsTable = () => {
    const [church, setChurch] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [currentVendor, setCurrentVendor] = useState<IVendor|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [noChurch, setNoChurch] = useState<boolean>(false);
    const [deleteState, setDeleteState]=useState<ErrorProps>({message:'', error:false});
    const {vendors, error, loading} = useFetchVendors();
    const {churches} = useFetchChurches();

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

    const message = `Are you sure you want to delete this vendor?`

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
            await deleteVendor(currentVendor._id);
            setDeleteMode(false);
            setCurrentVendor(null);
            setDeleteState({message:'Vendor deleted successfully', error:false});
            router.refresh();
          } catch (error) {
            console.log(error)
            setDeleteState({message:'Error occured deleting vendor', error:true})
          }
        }
      }

      if(loading) return <CircularIndeterminate className={`${loading ? 'flex-center':'hidden'}`}  error={error} />

  return (
    <div className='flex flex-col gap-5 rounded bg-white border dark:bg-black p-4 w-full overflow-x-scroll scrollbar-custom' >
        <div className="flex justify-between items-center">
            <SearchSelectChurch setSelect={setChurch} isGeneric />
            <div className="flex items-center gap-2">
                <SearchBar reversed={false} setSearch={setSearch} />
                <AddButton onClick={handleOpenNew} noIcon text='Add Vendor' smallText className='rounded' />
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
        <VendorInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentVendor={currentVendor} setCurrentVendor={setCurrentVendor} />

        <NewVendor openVendor={newMode} setOpenVendor={setNewMode} currentVendor={currentVendor} setCurrentVendor={setCurrentVendor} />

        <div className="flex">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    getRowId={(row:IVendor):string=>row?._id}
                    rows={SearchVendor(vendors, search, church)}
                    columns={VendorsColumns(hadndleInfo, hadndleDelete, hadndleNew)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border dark:text-blue-800 scrollbar-custom'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>

    </div>
  )
}

export default VendorsTable