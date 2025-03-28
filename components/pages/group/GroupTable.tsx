'use client'
import AddButton from '@/components/features/AddButton';
// import SearchBar from '@/components/features/SearchBar';
// import SearchSelectEvents from '@/components/features/SearchSelectEvents';
import {  Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {  useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, } from 'react'
import { GroupColumns } from './GroupColumns';
// import {  SearchGroupWithoutEvent } from './fxn';
import { useFetchEvents } from '@/hooks/fetch/useEvent';
import {  useFetchGroupsForEvent } from '@/hooks/fetch/useGroups';
import { IGroup } from '@/lib/database/models/group.model';
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, canPerformEvent, churchRoles, eventOrganizerRoles, groupRoles, groupRolesExtended, roomRoles } from '@/components/auth/permission/permission';
import Link from 'next/link';
import { checkIfAdmin } from '@/components/Dummy/contants';

type GroupTableProps = {
  eventId:string,
  setEventId:Dispatch<SetStateAction<string>>
}

const GroupTable = ({eventId, setEventId}:GroupTableProps) => {
    const {user} = useAuth();
    // const [search, setSearch] = useState<string>('');
    const {events} = useFetchEvents();
    const {groups, loading} = useFetchGroupsForEvent(eventId);
    const searchParams = useSearchParams();
    const router = useRouter();
    // console.log('Groups here: ',groups)

    // console.log('Church: ', groups[0]?.churchId)
    const creator  = canPerformAction(user!, 'creator', {groupRoles});
    const reader = canPerformAction(user!, 'reader', {groupRoles});
    const admin = canPerformAction(user!, 'admin', {groupRoles});
    const updater = canPerformAction(user!, 'updater', {groupRoles}) || groupRolesExtended.assign(user!);
    const showChurch = canPerformAction(user!, 'reader', {churchRoles});
    const showRoom = canPerformAction(user!, 'reader', {roomRoles});
    const isAdmin = checkIfAdmin(user);

    const orgReader = canPerformEvent(user!, 'reader', {eventOrganizerRoles});
    // const orgCreator = canPerformEvent(user!, 'creator', {eventOrganizerRoles});
    const orgUpdater = canPerformEvent(user!, 'updater', {eventOrganizerRoles});
    // const orgDeleter = canPerformEvent(user!, 'deleter', {eventOrganizerRoles});
    const orgAdmin = canPerformEvent(user!, 'admin', {eventOrganizerRoles});

    const canAdmin = admin || orgAdmin;
    const canRead = reader || orgReader;
    // const canCreate = creator || orgCreator;
    const canUpdate = updater || orgUpdater;
    const canRoom = orgReader || showRoom;

    useEffect(()=>{
      if(user && (!canAdmin)){
        router.replace('/dashboard/forbidden?p=Group Admin');
      }
    },[user, canAdmin, router])

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

    if(!canAdmin) return;
    // const router = useRouter()
  return (
    <div className='table-main2' >
        <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
          <SearchSelectEventsV2 setSelect={setEventId}  />
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                {
                  creator &&
                  <Link href={'/dashboard/groups/new'} >
                    <AddButton smallText text='Add Group' className='rounded' />
                  </Link>
                }
            </div>
        </div> 
       
        <div className="flex w-full">
          <Paper className='' sx={{ height: 'auto', }}>
              <DataGrid
                  rows={groups}
                  getRowId={(row:IGroup)=>row._id}
                  columns={GroupColumns(canRead, canUpdate, showChurch, canRoom)}
                  initialState={{ 
                    pagination: { paginationModel },
                    columns:{columnVisibilityModel:{churchId:isAdmin}}
                  }}
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