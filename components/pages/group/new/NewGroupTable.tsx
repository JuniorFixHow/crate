'use client'
// import SearchBar from '@/components/features/SearchBar'
// import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import Subtitle from '@/components/features/Subtitle'
import {  Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { NewGroupColumns } from './NewGroupColumns'
import NewGroupDown from './NewGroupDown'
import {  useFetchRegistrationsWithEvents } from '@/hooks/fetch/useRegistration'
import { getNextGroupNumber } from '@/lib/actions/misc'
import { IRegistration } from '@/lib/database/models/registration.model'
// import { SearchMemberForNewGroup } from './fxn'
import { useFetchEvents } from '@/hooks/fetch/useEvent'
// import SearchSelectZones from '@/components/features/SearchSelectZones'
// import SearchSelectChurchForRoomAss from '@/components/features/SearchSelectChurchForRoomAss'
import { useAuth } from '@/hooks/useAuth'
import { canPerformAction, groupRoles, isSuperUser, isSystemAdmin, memberRoles } from '@/components/auth/permission/permission'
import { useRouter } from 'next/navigation'
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2'
import SearchSelectZoneV2 from '@/components/features/SearchSelectZonesV2'
import SearchSelectChurchesWithZone from '@/components/features/SearchSelectChurchesWithZone'

const NewGroupTable = () => {
  const {user} = useAuth();
  const [eventId, setEventId] = useState<string>('');
  const [churchId, setChurchId] = useState<string>('');
  const [zoneId, setZoneId] = useState<string>('');
  const [membersId, setMembersId] = useState<string[]>([]);
  // const [search, setSearch] = useState<string>('');
  const [number, setNumber] = useState<number>(0);
  const router = useRouter();

  const {events} = useFetchEvents();
  
  const creator = canPerformAction(user!, 'creator', {groupRoles});
  const showMember = canPerformAction(user!, 'reader', {memberRoles});
  const isAdmin = isSystemAdmin.reader(user!) || isSuperUser(user!);
  
  const cId = isAdmin ? churchId : user?.churchId;
  const {eventRegistrations, loading} = useFetchRegistrationsWithEvents(eventId, cId as string);
  // console.log(cId)

  // console.log(object)
  useEffect(()=>{
    if(user && !creator){
      router.replace('/dashboard/forbidden?p=Group Creator');
    }
  },[user, creator, router])

  const handleCheckClick = (id:string)=>{
    setMembersId((prev)=>(
      prev.includes(id) ?
      prev.filter((item)=>item !== id)
      :
      [...prev, id]
    ))
  }

  useEffect(()=>{
    const fetchNextNumber = async()=>{
      try {
        const {nextGroupNumber} = await getNextGroupNumber();
        setNumber(nextGroupNumber);
      } catch (error) {
        console.log(error)
      }
    }
    fetchNextNumber();
  },[])

  useEffect(()=>{
    if(events.length>0){
      setEventId(events[0]._id);
    }
  },[events])

  const paginationModel = { page: 0, pageSize: 10 };
  if(!creator) return;
  return (
    <div className='table-main2' >
      <div className="w-full p-4 rounded-t border border-slate-300 bg-white dark:bg-[#0F1214]">
        <Subtitle text='Create a group' />
      </div>
      <div className="flex flex-col border border-slate-300 gap-4 bg-white dark:bg-[#0F1214] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className='text-[0.9rem]' >Group number: <span className='font-semibold' >{number}</span></span>
          <div className="px-3 py-2 rounded border">
            <span className='text-[0.9rem]' >Members selected: <span className='font-semibold' >{membersId.length}</span></span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-4 flex-col md:flex-row md:items-center md:justify-between">
            <SearchSelectEventsV2 setSelect={setEventId}/>
            {/* <SearchBar className='py-1' setSearch={setSearch} reversed={false} /> */}
          </div>
          {
            isAdmin &&
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-5">
              <SearchSelectZoneV2 setSelect={setZoneId}/>
              <SearchSelectChurchesWithZone zoneId={zoneId} setSelect={setChurchId} />
            </div>
          }

          {
            (cId && eventId) &&
            <div className="flex w-full">
              
                <Paper className='w-full' sx={{ height: 'auto', }}>
                    <DataGrid
                      getRowId={(row:IRegistration)=>row._id}
                      rows={eventRegistrations}
                      columns={NewGroupColumns(membersId, handleCheckClick, showMember, isAdmin)}
                      initialState={{ 
                        pagination: { paginationModel },
                        columns:{
                          columnVisibilityModel:{
                            church:isAdmin
                          }
                        } 
                      }}
                      pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                      loading={loading && !!eventId && !!cId}
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
          }

          {
            membersId.length > 0 &&
            <NewGroupDown eventId={eventId} members={membersId} />
          }
        </div>
      </div>
    </div>
  )
}

export default NewGroupTable