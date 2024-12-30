import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import VenueDetails from "./VenueDetails"

const NewVenueMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title className="hidden md:block" clickable link="/dashboard/venues" text="Venues" />
            <IoIosArrowForward className="hidden md:block" />
            <Title text="New" />
        </div>
        <VenueDetails/>
    </div>
  )
}

export default NewVenueMain