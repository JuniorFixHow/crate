'use client'
import AddButton from '@/components/features/AddButton';
import React, { useEffect, useState } from 'react'
import {  Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {  SearchChurchV2 } from './fxn';
import { ChurchColumns } from './ChurchColumns';
import DeleteDialog from '@/components/DeleteDialog';
import ChurchInfoModal from './ChurchInfoModal';
import NewChurch from './NewChurch';
import { useSearchParams } from 'next/navigation';
// import { useFetchZones } from '@/hooks/fetch/useZone';
import {  useFetchChurchesV2 } from '@/hooks/fetch/useChurch';
import { IChurch } from '@/lib/database/models/church.model';
import { deleteChurch, getChurch } from '@/lib/actions/church.action';
// import { ErrorProps } from '@/types/Types';
import Link from 'next/link';
import SearchSelectZoneV2 from '@/components/features/SearchSelectZonesV2';
import { enqueueSnackbar } from 'notistack';

const ChurchTable = () => {
    // const [search, setSearch] = useState<string>('');
    const [zone, setZone] = useState<string>('');
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [noZone, setNoZone] = useState<boolean>(false);
    const [currentChurch, setCurrentChurch] = useState<IChurch|null>(null);
    // const [deleteState, setDeleteState]=useState<ErrorProps>({message:'', error:false});
    // console.log('zone: ', zone)

    // const {zones} = useFetchZones();
    const {churches, isPending, refetch} = useFetchChurchesV2();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchChurch = async () => {
          const data = searchParams?.get('id');
          if (data) {
            const church: IChurch = await getChurch(data); // Await the promise
            setCurrentChurch(church);
            setInfoMode(true);
          }
        };
      
        fetchChurch(); // Call the async function
      }, [searchParams]);
      

    const paginationModel = { page: 0, pageSize: 10 };

    // const handleNewChurch = (data:IChurch)=>{
    //     setCurrentChurch(data);
    //     setNewMode(true);
    // }

    const hadndleInfo = (data:IChurch)=>{
        setCurrentChurch(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:IChurch)=>{
        setCurrentChurch(data);
        setDeleteMode(true);
    }
    // const handleOpenNew = ()=>{
    //    if(zones.length <= 0){
    //     setNoZone(true);
    //    }else{
    //     setCurrentChurch(null);
    //     setNewMode(true);
    //    }
    // }

    const handleDeleteChurch = async()=>{
        if(currentChurch){
          try {
            const res = await deleteChurch(currentChurch._id);
            setDeleteMode(false);
            setCurrentChurch(null);
            refetch();
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            // setDeleteState({message:'Zone deleted successfully', error:false})
          } catch (error) {
            console.log(error)
            enqueueSnackbar('Error occured deleting church', {variant:'error'});
            // setDeleteState({message:'Error occured deleting zone', error:true})
          }
        }
      }


    const message = 'Deleting the church will delete all members and campuses that have been registered for it. Proceed?'
  return (
    <div className='table-main2' >
        <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
            <div className="flex">

                <SearchSelectZoneV2  setSelect={setZone} />
            </div>
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
                <Link href={'/dashboard/churches/new'} >
                  <AddButton  smallText text='Add Church' noIcon className='rounded' />
                </Link>
            </div>
        </div> 
        
        
        <ChurchInfoModal currentChurch={currentChurch} setCurrentChurch={setCurrentChurch} infoMode={infoMode} setInfoMode={setInfoMode} />
        <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentChurch?.name}`} message={message} onTap={handleDeleteChurch} />
        <NewChurch currentChurch={currentChurch} setCurrentChurch={setCurrentChurch} infoMode={newMode} setInfoMode={setNewMode} />
        {/* {
            noZone &&
            <Alert onClose={()=>setNoZone(false)} severity='error' >No zones available. Create a zone to add a new church</Alert>
        } */}
        {/* {
            deleteState?.message &&
            <Alert onClose={()=>setDeleteState({message:'', error:false})}  className='text-center' severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
        } */}

        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    getRowId={(row:IChurch):string=> row?._id as string}
                    rows={SearchChurchV2(churches,  zone)}
                    columns={ChurchColumns(hadndleInfo,  hadndleDelete)}
                    initialState={{ 
                      pagination: { paginationModel },
                      columns:{
                        columnVisibilityModel:{
                          contractId:false
                        }
                      } 
                    }}
                    loading={isPending}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
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

export default ChurchTable