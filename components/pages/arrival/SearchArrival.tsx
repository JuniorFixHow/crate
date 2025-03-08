import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import NewArrivalSearch from "./NewSearchArrival"

const SearchArrival = () => {
  return (
    <div className="page" >
        <div className="flex flex-row items-baseline gap-2">
            <Title className="hidden md:block" clickable link='/dashboard/events/badges' text='Registrations' />
            <IoIosArrowForward className="hidden md:block" />
            <Title clickable link="/dashboard/events/arrivals" text='Arrivals' />
            <IoIosArrowForward/>
            <Title text='New Arrivals' />
        </div>
        <NewArrivalSearch/>
    </div>
  )
}

export default SearchArrival