import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import ServicesTable from "./ServiceTable"

const ServiceMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title className="hidden md:block" clickable link="/dashboard/churches" text="Churches" />
            <IoIosArrowForward className="hidden md:block" />
            <Title text="Contracts" clickable link="/dashboard/churches/contracts" />
            <IoIosArrowForward/>
            <Title text="Services" />
        </div>
        <ServicesTable/>
    </div>
  )
}

export default ServiceMain