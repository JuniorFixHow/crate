'use client'
import AddButton from "@/components/features/AddButton"
import SearchBar from "@/components/features/SearchBar"
import SearchSelectEvents from "@/components/features/SearchSelectEvents"
import { useFetchRoomsRegistrationWithKeys } from "@/hooks/fetch/useRoom"
import { LinearProgress } from "@mui/material"
import { useEffect, useRef, useState } from "react"

import SearchSelectZones from "@/components/features/SearchSelectZones"
import SearchSelectChurchForRoomAss from "@/components/features/SearchSelectChurchForRoomAss"
import { saveDataToExcel, SearchMerged } from "./fxn"
import Title from "@/components/features/Title"
import { IEvent } from "@/lib/database/models/event.model"
import { getEvent } from "@/lib/actions/event.action"
import CustomSummaryTable from "./CustomSummaryTable"

const RoomSummaryTable = () => {
    const [search, setSearch] = useState<string>('');
    const {data, loading} = useFetchRoomsRegistrationWithKeys();
    const [eventId, setEventId] = useState<string>('');
    const [zoneId, setZoneId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const [event, setEvent] = useState<IEvent|null>(null);


    const printRef = useRef<HTMLDivElement>(null);

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


    // console.log(loading)

    const title = event?.name || 'Full Record'
  return (
    <div className="table-w" >
        <div className="flex items-end gap-4">
            <SearchSelectZones isGeneric setSelect={setZoneId} />
            <SearchSelectChurchForRoomAss isGeneric zoneId={zoneId} setSelect={setChurchId} />
        </div>
        <div className="flex items-end justify-between">
            <SearchSelectEvents setSelect={setEventId} isGeneric />
            <div className="flex items-center gap-4">
                <SearchBar setSearch={setSearch} reversed={false} />
                <AddButton onClick={handlePrint} text="Print" noIcon smallText className="rounded" />
                <AddButton onClick={()=>saveDataToExcel(SearchMerged(data,search,churchId,zoneId,eventId), title)} text="Export" noIcon smallText className="rounded" />
            </div>
        </div>

        <div ref={printRef} id="print"  className="flex flex-col gap-4 w-full">
            {
                event &&
                <Title text={event.name} />
            }
            {
                loading ?
                <LinearProgress className="w-full" aria-describedby="loading..." />
                :
                <CustomSummaryTable data={SearchMerged(data,search,churchId,zoneId,eventId)} />
            }
          </div>
    </div>
  )
}

export default RoomSummaryTable