import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import VenueDetails from "./VenueDetails"
import { IVenue } from "@/lib/database/models/venue.model"

type NewVenueMainProps = {
  currentVenue?:IVenue
}

const NewVenueMain = ({currentVenue}:NewVenueMainProps) => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title className="hidden md:block" clickable link="/dashboard/venues" text="Venues" />
            <IoIosArrowForward className="hidden md:block" />
            <Title text="New" />
        </div>
        <VenueDetails currentVenue={currentVenue} />
    </div>
  )
}

export default NewVenueMain