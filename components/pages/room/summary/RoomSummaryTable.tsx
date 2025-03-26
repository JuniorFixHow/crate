'use client'
import AddButton from "@/components/features/AddButton"
import SearchBar from "@/components/features/SearchBar"
import { useFetchRoomsRegistrationWithKeys } from "@/hooks/fetch/useRoom"
import { useEffect,  useRef,  useState } from "react"

import {  saveDataToExcel, SearchMerged,  } from "./fxn"
import { IEvent } from "@/lib/database/models/event.model"
import { getEvent } from "@/lib/actions/event.action"
import CustomSummaryTable from "./CustomSummaryTable"
import SearchSelectZoneV2 from "@/components/features/SearchSelectZonesV2"
import SearchSelectChurchesWithZone from "@/components/features/SearchSelectChurchesWithZone"
import SearchSelectEventsV2 from "@/components/features/SearchSelectEventsV2"
import { useAuth } from "@/hooks/useAuth"
import { canPerformAction, eventRegistrationRoles,  isSuperUser, isSystemAdmin, } from "@/components/auth/permission/permission"
// import { Paper } from "@mui/material"
// import { DataGrid, GridToolbar } from "@mui/x-data-grid"
// import { RoomSummaryColumn } from "./RoomSummaryColumns"
// import { IMergedRegistrationData } from "@/types/Types"
import { useRouter } from "next/navigation"
import '@/components/features/customscroll.css';

const RoomSummaryTable = () => {
    const {user} = useAuth();
    const [search, setSearch] = useState<string>('');
    const {data, loading} = useFetchRoomsRegistrationWithKeys();
    const [eventId, setEventId] = useState<string>('');
    const [zoneId, setZoneId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const router  = useRouter();
    const [event, setEvent] = useState<IEvent|null>(null);

    const reader = canPerformAction(user!, 'reader', {eventRegistrationRoles});
    
    const isAdmin = isSuperUser(user!) || isSystemAdmin.reader(user!);

    const printRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
      if(user && !reader){
        router.replace('/dashboard/forbidden?p=Event Registration Reader');
      }
    },[user, reader, router])

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore original React state
    }
  };


    useEffect(()=>{
        const fetchEvent = async()=>{
            if(eventId){
                try {
                    const evt = await getEvent(eventId)
                    setEvent(evt);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchEvent();
    },[eventId])


    // const paginationModel = { page: 0, pageSize: 10 };
    // console.log(loading)

    const title = event?.name || 'Full Record';
    if(!reader) return;
  return (
    <div className="table-main2" >
        {
          isAdmin &&
          <div className="flex flex-col md:flex-row gap-4">
              <SearchSelectZoneV2  setSelect={setZoneId} />
              <SearchSelectChurchesWithZone  zoneId={zoneId} setSelect={setChurchId} />
          </div>
        }
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <SearchSelectEventsV2 setSelect={setEventId} />
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <SearchBar setSearch={setSearch} reversed={false} className="py-1" />
                <AddButton onClick={handlePrint} text="Print" noIcon smallText className="rounded justify-center" />
                <AddButton onClick={()=>saveDataToExcel(SearchMerged(data,search,churchId,zoneId,eventId), title)} text="Export" noIcon smallText className="rounded justify-center" />
            </div>
        </div>


        {/* <div className="flex w-full">
          <Paper className='w-full' sx={{ height: 'auto', }}>
            <DataGrid
                rows={SearchMergedV2(data,churchId,zoneId,eventId)}
                columns={RoomSummaryColumn(showMember, isAdmin, showGroup, showRoom, showKey)}
                initialState={{ 
                  pagination: { paginationModel },
                  columns:{
                    columnVisibilityModel:{
                      church:isAdmin,
                      zone:isAdmin
                    }
                  }
                }}
                pageSizeOptions={[5, 10, 20, 30, 50, 100]}
                getRowId={(row:IMergedRegistrationData):string=>row?._id}
                slots={{toolbar:GridToolbar}}
                loading={loading}
                slotProps={{
                    toolbar:{
                        showQuickFilter:true,
                        printOptions:{
                            hideFooter:true,
                            hideToolbar:true
                        }
                    }
                }}
                className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                sx={{ border: 0 }}
            />
            </Paper>
          </div> */}
          <div className="flex flex-row max-w-[90vw] lg:max-w-[92vw] xl:max-w-[80vw] scrollbar-custom2 overflow-x-scroll lg:overflow-x-hidden">
            <CustomSummaryTable loading={loading} data={SearchMerged(data,search,churchId,zoneId,eventId)} printRef={printRef} event={event} />
          </div>
       
    </div>
  )
}

export default RoomSummaryTable