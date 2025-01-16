import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import NewActivityTable from "./NewActivityTable"

const NewActivityMain = () => {
  return (
    <div className="page" >
         <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/activities" text="Activities" />
            <IoIosArrowForward/>
            <Title text="New" />
        </div>
        <NewActivityTable/>
    </div>
  )
}

export default NewActivityMain