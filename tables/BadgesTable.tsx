'use client'
import FilterBar from '@/components/FilterBar'
import { BadgesColumns } from '@/Dummy/contants'
import { EventRegistrations } from '@/Dummy/Data'
import BadgeInfoModal from '@/features/badges/BadgeInfoModal'
import SearchBar from '@/features/SearchBar'
import { searchBadge } from '@/functions/search'
import { EventRegProps } from '@/types/Types'
import { Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const BadgesTable = () => {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState<string>('')

    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [currentEventReg, setCurrentEventReg] = useState<EventRegProps|null>(null);

    const paginationModel = { page: 0, pageSize: 10 };
    const router = useRouter();

    const handleInfo = (data:EventRegProps)=>{
        setInfoMode(true);
        setCurrentEventReg(data);
    }

    useEffect(()=>{
        const data = searchParams?.get('regId');
        if(data){
            setCurrentEventReg(EventRegistrations.filter((item)=>item?.id === data)[0])
            setInfoMode(true);
        }
    },[searchParams])

  return (
    <div className='flex flex-col gap-4 w-full' >
        <div className="flex flex-row items-start justify-between">
            <FilterBar />
            <button onClick={()=>router.push('/dashboard/events/badges/new')}  className='bg-white px-4 py-2 hover:bg-slate-200 dark:hover:border-blue-800 shadow dark:bg-black dark:border' >Print</button>
        </div>

        <BadgeInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentEventReg={currentEventReg} setCurrentEventReg={setCurrentEventReg} />
        {/* table */}

        <div className="flex flex-col gap-2">
            <div className="flex items-center flex-row justify-end w-full">
                <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
            </div>

        <div className="flex w-full">
            <Paper  className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={searchBadge(search, EventRegistrations)}
                    columns={BadgesColumns(handleInfo)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border dark:text-orange-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    </div>
    </div>
  )
}

export default BadgesTable