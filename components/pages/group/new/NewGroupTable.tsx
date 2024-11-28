'use client'
import { EventsData, members } from '@/components/Dummy/Data'
import SearchBar from '@/components/features/SearchBar'
import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import Subtitle from '@/components/features/Subtitle'
import { searchMember } from '@/functions/search'
import { Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import { NewGroupColumns } from './NewGroupColumns'
import NewGroupDown from './NewGroupDown'

const NewGroupTable = () => {
  const event1 = EventsData[0]?.id;
  const [eventId, setEventId] = useState<string>(event1);
  const [membersId, setMembersId] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  console.log(eventId)
  const handleCheckClick = (id:string)=>{
    setMembersId((prev)=>(
      prev.includes(id) ?
      prev.filter((item)=>item !== id)
      :
      [...prev, id]
    ))
  }

  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div className='w-full flex flex-col' >
      <div className="w-full p-4 rounded-t border border-slate-300 bg-white dark:bg-black">
        <Subtitle text='Create a group' />
      </div>
      <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-black p-4">
        <div className="flex items-center justify-between">
          <span className='text-[0.9rem]' >Group number: <span className='font-semibold' >22</span></span>
          <div className="flex-center px-3 py-2 rounded border">
            <span className='text-[0.9rem]' >Members selected: <span className='font-semibold' >{membersId.length}</span></span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <SearchSelectEvents setSelect={setEventId} isGeneric/>
            <SearchBar setSearch={setSearch} reversed={false} />
          </div>

          <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 480, }}>
                <DataGrid
                  rows={searchMember(search, members)}
                  columns={NewGroupColumns(membersId, handleCheckClick)}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  // checkboxSelection
                  className='dark:bg-black dark:border dark:text-blue-800'
                  sx={{ border: 0 }}
                />
            </Paper>
          </div>

          <NewGroupDown/>
        </div>
      </div>
    </div>
  )
}

export default NewGroupTable