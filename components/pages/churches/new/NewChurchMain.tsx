import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import ChurchDetails from "./ChurchDetails"

const NewChurchMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/churches" text="Churches" />
          <IoIosArrowForward/>
          <Title text="New Church" />
        </div>
        <ChurchDetails/>
    </div>
  )
}

export default NewChurchMain