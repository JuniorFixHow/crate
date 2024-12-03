'use client'
import { BadgesColumns } from '@/components/Dummy/contants'
import BadgeInfoModal from '@/components/features/badges/BadgeInfoModal'
import SearchBar from '@/components/features/SearchBar'
import { searchBadge } from '@/functions/search'
import { Alert, LinearProgress, Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import RegistrationFilterBar from '../features/badges/RegistrationFilterBar'
import { useFetchRegistrations } from '@/hooks/fetch/useRegistration'
import { IRegistration } from '@/lib/database/models/registration.model'
import { deleteReg, getReg } from '@/lib/actions/registration.action'
import DeleteDialog from '../DeleteDialog'
import { ErrorProps } from '@/types/Types'

type BadgesTableProps = {
    noHeader?:boolean,
    eventId:string,
    setEventId?:Dispatch<SetStateAction<string>>
}
const BadgesTable = ({noHeader, setEventId, eventId}:BadgesTableProps) => {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState<string>('');
    const [room, setRoom] = useState<string>('');
    const [badge, setBadge] = useState<string>('');
    const [date, setDate] = useState<string>('');

    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentEventReg, setCurrentEventReg] = useState<IRegistration|null>(null);
    const [deleteError, setDeleteError] = useState<ErrorProps>(null)

    const paginationModel = { page: 0, pageSize: 10 };
    const router = useRouter();

    const {registrations, loading} = useFetchRegistrations();

    const reset = ()=>{
        setRoom('');
        setDate('');
        setEventId!('');
        setSearch('');
        setBadge('');
    }
    const handleInfo = (data:IRegistration)=>{
        setInfoMode(true);
        setCurrentEventReg(data);
    }

    const handleDelete = (data:IRegistration)=>{
        setDeleteMode(true);
        setCurrentEventReg(data);
    }

    useEffect(()=>{
        const fetchRegistation = async()=>{
            try {
                const id = searchParams?.get('regId');
                if(id){
                    const reg:IRegistration =  await getReg(id);
                    setCurrentEventReg(reg)
                    setInfoMode(true);
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchRegistation()
    },[searchParams])


    const handleDeleteReg = async()=>{
        setDeleteError(null);
        try {
            if(currentEventReg){
                await deleteReg(currentEventReg?._id)
                setDeleteError({message:'Record deleted successfully', error:false});
                setDeleteMode(false);
                setCurrentEventReg(null);
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setDeleteError({message:'Error occured trying to delete the registration', error:true})
        }
    }

    const message = `You're about to remove this member from the event registration. This will delete their attendance records as well. Are you sure of what you're doing?`


  return (
    <div className='flex flex-col gap-4 w-full' >
        {
            !noHeader &&
            <div className="flex flex-row items-start justify-between">
                <RegistrationFilterBar 
                    setBadge={setBadge} setDate={setDate}
                    setRoom={setRoom} reset={reset}
                />
                <button onClick={()=>router.push('/dashboard/events/badges/new')}  className='bg-white px-4 py-2 hover:bg-slate-200 dark:hover:border-blue-800 shadow dark:bg-black dark:border' >Print</button>
            </div>
        }


        <DeleteDialog onTap={handleDeleteReg} title={`Delete ${typeof currentEventReg?.memberId === 'object' && 'name' in currentEventReg?.memberId && currentEventReg?.memberId.name}`}  value={deleteMode} setValue={setDeleteMode} message={message} />
        <BadgeInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentEventReg={currentEventReg} setCurrentEventReg={setCurrentEventReg} />
        {/* table */}

        <div className="flex flex-col gap-2">
            <div className="flex items-center flex-row justify-end w-full">
                <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
            </div>

        {
            deleteError?.message &&
            <Alert onClose={()=>setDeleteError(null)} severity={deleteError.error ? 'error':'success'} >{deleteError.message}</Alert>
        }
        <div className="table-main">
            {
                loading ?
                <LinearProgress className='w-full' />
                :
                <Paper  className='w-full' sx={{ height: 480, }}>
                    <DataGrid
                        getRowId={(row:IRegistration)=>row._id}
                        rows={searchBadge(registrations, eventId, badge, date, room, search)}
                        columns={BadgesColumns(handleInfo, handleDelete)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        // checkboxSelection
                        className='dark:bg-black dark:border dark:text-orange-800'
                        sx={{ border: 0 }}
                    />
                </Paper>
            }
        </div>
    </div>
    </div>
  )
}

export default BadgesTable