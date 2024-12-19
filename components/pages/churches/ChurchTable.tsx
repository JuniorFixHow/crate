'use client'
import AddButton from '@/components/features/AddButton';
import SearchBar from '@/components/features/SearchBar'
import React, { useEffect, useState } from 'react'
import { Alert, LinearProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { SearchChurch } from './fxn';
import { ChurchColumns } from './ChurchColumns';
import DeleteDialog from '@/components/DeleteDialog';
import ChurchInfoModal from './ChurchInfoModal';
import NewChurch from './NewChurch';
import { useSearchParams } from 'next/navigation';
import { useFetchZones } from '@/hooks/fetch/useZone';
import { useFetchChurches } from '@/hooks/fetch/useChurch';
import { IChurch } from '@/lib/database/models/church.model';
import { deleteChurch, getChurch } from '@/lib/actions/church.action';
import SearchSelectZones from '@/components/features/SearchSelectZones';
import { ErrorProps } from '@/types/Types';

const ChurchTable = () => {
    const [search, setSearch] = useState<string>('');
    const [zone, setZone] = useState<string>('');
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [noZone, setNoZone] = useState<boolean>(false);
    const [currentChurch, setCurrentChurch] = useState<IChurch|null>(null);
    const [deleteState, setDeleteState]=useState<ErrorProps>({message:'', error:false});
    // console.log('zone: ', zone)

    const {zones} = useFetchZones();
    const {churches, loading} = useFetchChurches();
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

    const handleNewChurch = (data:IChurch)=>{
        setCurrentChurch(data);
        setNewMode(true);
    }

    const hadndleInfo = (data:IChurch)=>{
        setCurrentChurch(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:IChurch)=>{
        setCurrentChurch(data);
        setDeleteMode(true);
    }
    const handleOpenNew = ()=>{
       if(zones.length <= 0){
        setNoZone(true);
       }else{
        setCurrentChurch(null);
        setNewMode(true);
       }
    }

    const handleDeleteChurch = async()=>{
        setDeleteState({message:'', error:false})
        if(currentChurch){
          try {
            await deleteChurch(currentChurch._id);
            setDeleteMode(false);
            setCurrentChurch(null);
            setDeleteState({message:'Zone deleted successfully', error:false})
          } catch (error) {
            console.log(error)
            setDeleteState({message:'Error occured deleting zone', error:true})
          }
        }
      }


    const message = 'Deleting the church will delete all members that have been registered for it. Proceed?'
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded' >
        <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
            <div className="flex">

                <SearchSelectZones isGeneric setSelect={setZone} />
            </div>
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <AddButton onClick={handleOpenNew} smallText text='Add Church' noIcon className='rounded' />
            </div>
        </div> 
        
        
        <ChurchInfoModal currentChurch={currentChurch} setCurrentChurch={setCurrentChurch} infoMode={infoMode} setInfoMode={setInfoMode} />
        <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentChurch?.name}`} message={message} onTap={handleDeleteChurch} />
        <NewChurch currentChurch={currentChurch} setCurrentChurch={setCurrentChurch} infoMode={newMode} setInfoMode={setNewMode} />
        {
            noZone &&
            <Alert onClose={()=>setNoZone(false)} severity='error' >No zones available. Create a zone to add a new church</Alert>
        }
        {
            deleteState?.message &&
            <Alert onClose={()=>setDeleteState({message:'', error:false})}  className='text-center' severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
        }

        <div className="flex w-full">
          {
            loading ?
            <LinearProgress className='w-full' />
            :
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    getRowId={(row:IChurch):string=> row?._id as string}
                    rows={SearchChurch(churches, search, zone)}
                    columns={ChurchColumns(hadndleInfo, handleNewChurch, hadndleDelete)}
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

export default ChurchTable