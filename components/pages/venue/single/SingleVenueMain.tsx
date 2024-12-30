import Title from "@/components/features/Title"
import { IVenue } from "@/lib/database/models/venue.model"
import { IoIosArrowForward } from "react-icons/io"
import VenueDetails from "../new/VenueDetails"

type SingleVenueMainProps = {
    currentVenue:IVenue
}

const SingleVenueMain = ({currentVenue}:SingleVenueMainProps) => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title className="hidden md:block" clickable link="/dashboard/venues" text="Venues" />
            <IoIosArrowForward className="hidden md:block" />
            <Title text={currentVenue?.name} />
        </div>
        <VenueDetails currentVenue={currentVenue} />
    </div>
  )
}

export default SingleVenueMain