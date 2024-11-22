'use client'
import React, { useState } from 'react'
import VendorFilter from './VendorFilter'
import SearchBar from '@/features/SearchBar'
import AddButton from '@/features/AddButton'
import { VendorProps } from '@/types/Types'
import { SearchVendor } from './fxn'
import { VendorsColumns } from './VendorColumns'
import { VendorsData } from './VendorData'
import { DataGrid } from '@mui/x-data-grid'
import { Paper } from '@mui/material'
import '../../features/customscroll.css'
import VendorInfoModal from './VendorInfoModal'
import DeleteDialog from '@/components/DeleteDialog'
import NewVendor from './NewVendor'

const VendorsTable = () => {
    const [zone, setZone] = useState<string>('All Zones');
    const [search, setSearch] = useState<string>('');
    const [currentVendor, setCurrentVendor] = useState<VendorProps|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);

    const hadndleInfo = (data:VendorProps)=>{
        setCurrentVendor(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:VendorProps)=>{
        setCurrentVendor(data);
        setDeleteMode(true);
    }
    const hadndleNew = (data:VendorProps)=>{
        setCurrentVendor(data);
        setNewMode(true);
    }

    const paginationModel = { page: 0, pageSize: 10 };

    const message = `Are you sure you want to delete this vendor?`

  return (
    <div className='flex flex-col gap-5 rounded bg-white border dark:bg-black p-4 w-full overflow-x-scroll scrollbar-custom' >
        <div className="flex justify-between items-center">
            <VendorFilter setZone={setZone} />
            <div className="flex items-center gap-2">
                <SearchBar reversed={false} setSearch={setSearch} />
                <AddButton onClick={()=>setNewMode(true)} noIcon text='Add Vendor' smallText className='rounded' />
            </div>
        </div>
        <DeleteDialog onTap={()=>{}} message={message} title={`Delete ${currentVendor?.name}`} value={deleteMode} setValue={setDeleteMode} />
        <VendorInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentVendor={currentVendor} setCurrentVendor={setCurrentVendor} />

        <NewVendor openVendor={newMode} setOpenVendor={setNewMode} currentVendor={currentVendor} setCurrentVendor={setCurrentVendor} />

        <div className="flex">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={SearchVendor(VendorsData, search, zone)}
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