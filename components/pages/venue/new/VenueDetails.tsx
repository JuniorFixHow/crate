'use client'
import { IVenue } from "@/lib/database/models/venue.model"
import { useEffect, useState } from "react"
import NewVenue from "./NewVenue"
import SingleFacilityTable from "../single/SingleFacilityTable"
import { IFacility } from "@/lib/database/models/facility.model"
import SingleVenueRoomTable from "../single/SingleVenueRoomTable"
import { useAuth } from "@/hooks/useAuth"
import { canPerformAction, facilityRoles, roomRoles, venueRoles } from "@/components/auth/permission/permission"
import { useRouter } from "next/navigation"

export type VenueDetailsProps = {
    currentVenue?:IVenue
}
type TitleProps = 'Details'|'Facilities'|'Rooms'
const VenueDetails = ({currentVenue}:VenueDetailsProps) => {
    const [title, setTitle] = useState<TitleProps>('Details');
    const router = useRouter();
    const titles = ['Details', 'Facilities','Rooms'];
    const {user} = useAuth();

    const facReader = canPerformAction(user!, 'reader', {facilityRoles});
    const roomReader = canPerformAction(user!, 'reader', {roomRoles});
    const updater = canPerformAction(user!, 'updater', {venueRoles});
    const admin = canPerformAction(user!, 'admin', {venueRoles});
    // console.log(currentVenue?.facilities)

    useEffect(()=>{
        if(user && (!admin)){
            router.replace('/dashboard/forbidden?p=Venue Admin')
        }
    },[admin, router, user])

    if(!admin) return;

  return (
    <div className="bg-white dark:bg-[#0F1214] p-4 shadow dark:border rounded flex flex-col gap-5 min-h-[75vh]" >
        {
            currentVenue &&
            <div className="flex gap-4">
                {
                    titles
                    .filter((item)=> (facReader || updater) ? item: item !== 'Facilities')
                    .filter((item)=> (roomReader || updater) ? item: item !== 'Rooms')
                    .map((item)=>(
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