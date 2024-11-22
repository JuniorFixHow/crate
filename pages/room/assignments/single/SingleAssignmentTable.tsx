'use client'
import SearchBar from '@/features/SearchBar';
import Subtitle from '@/features/Subtitle';
import { EventRegProps } from '@/types/Types'
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { RoomData } from '../../RoomData';
import { SearchRoomWithoutEvent } from './fxn';
import { SingleAssignmentCoulmns } from './SingleAssignmentCoulmns';
import AddButton from '@/features/AddButton';

const SingleAssignmentTable = ({data}:{data:EventRegProps}) => {
    const paginationModel = { page: 0, pageSize: 10 };
    const [search, setSearch] = useState<string>('');
    const [currentId, setCurrentId] = useState<string>('');
    const [rooms, setRooms] = useState<string[]>([]);

    const handleSelect =(id:string)=>{
        setRooms((prev)=>(
            prev.includes(id) ? 
            rooms.filter((item)=>item !== id)
            :
            [...prev, id]
        ))
    }

    const handleRadio = (id:string)=>{
        setCurrentId(currentId === id ? '':id);
    }

    // console.log(data.regType);

  return (
    <div className='flex flex-1 flex-col gap-2' >
        <Subtitle text={data?.regType === 'Individual' ? 'Pick Room':'Pick Rooms'} />
        <div className="flex flex-col lg:w-fit lg:mt-4">
            <span className='text-slate-500 text-[0.8rem]' >No. of beds</span>
            <input min={1} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
        </div>
        <SearchBar className='w-fit lg:self-end' setSearch={setSearch} reversed={false} />

        <div className="flex w-full">
              <Paper className='w-full' sx={{ height: 480, }}>
                  <DataGrid
                      rows={SearchRoomWithoutEvent(RoomData, search)}
                      columns={SingleAssignmentCoulmns(rooms, handleSelect, currentId, handleRadio, data)}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      // checkboxSelection
                      className='dark:bg-black dark:border dark:text-blue-800'
                      sx={{ border: 0 }}
                  />
              </Paper>
        </div>
        {
            currentId &&
            <AddButton text='Assign Room' noIcon smallText className='py-2 px-4 self-end rounded w-fit' />
        }
    </div>
  )
}

export default SingleAssignmentTable