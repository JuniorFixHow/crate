import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import ArrivalTable from "./ArrivalTable"

const ArrivalMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row items-baseline gap-2">
            <Title clickable link='/dashboard/events/badges' text='Registrations' />
            <IoIosArrowForward/>
            <Title text='Arrivals' />
        </div>
        <ArrivalTable/>
    </div>
  )
}

export default ArrivalMain