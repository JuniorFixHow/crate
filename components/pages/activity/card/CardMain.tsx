import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import CardTable from "./CardTable"

const CardMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/activities" text="Activities" />
            <IoIosArrowForward/>
            <Title text='Cards' />
        </div>
        <CardTable/>
    </div>
  )
}

export default CardMain