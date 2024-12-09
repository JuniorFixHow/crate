import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import KeysTable from "./KeysTable"

const KeysMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/rooms" text="Rooms" />
            <IoIosArrowForward/>
            <Title text="Keys" />
        </div>
        <KeysTable/>
    </div>
  )
}

export default KeysMain