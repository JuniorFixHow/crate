import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import CampusTable from "./CampusTable"

const CampusMain = () => {
  return (
    <div className="page" >
      <div className="flex flex-row gap-2 items-baseline">
        <Title clickable link="/dashboard/churches" text="Churches" />
        <IoIosArrowForward/>
        <Title text="Campuses" />
      </div>
      <CampusTable/>
    </div>
  )
}

export default CampusMain