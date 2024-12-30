'use client'
import { IVenue } from "@/lib/database/models/venue.model"
import { useState } from "react"
import NewVenue from "./NewVenue"
import SingleFacilityTable from "../single/SingleFacilityTable"
import { IFacility } from "@/lib/database/models/facility.model"
import SingleVenueRoomTable from "../single/SingleVenueRoomTable"

export type VenueDetailsProps = {
    currentVenue?:IVenue
}
type TitleProps = 'Details'|'Facilities'|'Rooms'
const VenueDetails = ({currentVenue}:VenueDetailsProps) => {
    const [title, setTitle] = useState<TitleProps>('Details');
    const titles = ['Details', 'Facilities','Rooms']
  return (
    <div className="bg-white dark:bg-[#0F1214] p-4 shadow dark:border rounded flex flex-col gap-5 min-h-[75vh]" >
        {
            currentVenue &&
            <div className="flex gap-4">
                {
                    titles.map((item)=>(
                        <span onClick={()=>setTitle(item as TitleProps)} key={item} className={`font-semibold cursor-pointer ${title === item && 'border-b-2'} rounded-b border-b-blue-600`} >{item}</span>
                    ))
                }
            </div>
        }
        {
            title === 'Details' &&
            <NewVenue currentVenue={currentVenue} />
        }
        {
            title === 'Facilities' &&
            <SingleFacilityTable facilities={currentVenue?.facilities as IFacility[]} venueId={currentVenue?._id as string} />
        }
        {
            title === 'Rooms' &&
            <SingleVenueRoomTable venueId={currentVenue?._id as string} />
        }
    </div>
  )
}

export default VenueDetails