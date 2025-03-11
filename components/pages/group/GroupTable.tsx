'use client'
import AddButton from '@/components/features/AddButton';
// import SearchBar from '@/components/features/SearchBar';
// import SearchSelectEvents from '@/components/features/SearchSelectEvents';
import {  Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, } from 'react'
import { GroupColumns } from './GroupColumns';
// import {  SearchGroupWithoutEvent } from './fxn';
import { useFetchEvents } from '@/hooks/fetch/useEvent';
import {  useFetchGroupsForEvent } from '@/hooks/fetch/useGroups';
import { IGroup } from '@/lib/database/models/group.model';
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2';

type GroupTableProps = {
  eventId:string,
  setEventId:Dispatch<SetStateAction<string>>
}

const GroupTable = ({eventId, setEventId}:GroupTableProps) => {
    // const [search, setSearch] = useState<string>('');
    const {events} = useFetchEvents();
    const {groups, loading} = useFetchGroupsForEvent(eventId);
    const searchParams = useSearchParams();
    // console.log('Groups here: ',groups)

    // console.log('Church: ', groups[0]?.churchId)


    useEffect(() => {
      const fetchChurch = async () => {
        const data = searchParams?.get('eventId');
        if (data) {
          setEventId(data);
        }else{
          if(events?.length){
            setEventId(events[0]?._id)
          }
        }
      };  
      fetchChurch(); 
    }, [events, searchParams, setEventId]);
    
    const paginationModel = { page: 0, pageSize: 10 };
    const router = useRouter()
  return (
    <div className='table-main2' >
        <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
          <SearchSelectEventsV2 setSelect={setEventId}  />
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                {/* <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} /> */}
                <AddButton onClick={()=>router.push('/dashboard/groups/new')} smallText text='Add Group' className='rounded' />
            </div>
        </div> 
       
        <div className="flex w-full">
          <Paper className='w-full' sx={{ height: 'auto', }}>
              <DataGrid
                  rows={groups}
                  getRowId={(row:IGroup)=>row._id}
                  columns={GroupColumns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                  slots={{toolbar:GridToolbar}}
                  loading={loading && !!eventId}
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

export default GroupTable