'use client'
import AddButton from '@/components/features/AddButton';
import SearchBar from '@/components/features/SearchBar';
import SearchSelectEvents from '@/components/features/SearchSelectEvents';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { GroupColumns } from './GroupColumns';
import { EventsData } from '@/components/Dummy/Data';
import { GroupData } from './GroupData';
import { SearchGroup } from './fxn';

const GroupTable = () => {
    const event1 = EventsData[0].id;
    const [search, setSearch] = useState<string>('');
    const [eventId, setEventId] = useState<string>(event1);
    const paginationModel = { page: 0, pageSize: 10 };
    const router = useRouter()
  return (
    <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-black dark:border rounded' >
        <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
          <SearchSelectEvents setSelect={setEventId} isGeneric />
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <AddButton onClick={()=>router.push('/dashboard/groups/new')} smallText text='Add Group' className='rounded' />
            </div>
        </div> 
       
        <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                    rows={SearchGroup(GroupData, search, eventId)}
                    columns={GroupColumns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>

    </div>
  )
}

export default GroupTable