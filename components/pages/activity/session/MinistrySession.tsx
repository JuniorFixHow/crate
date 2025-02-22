import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import Sessions from "./Sessions"

const MinistrySession = () => {
  return (
    <div className="page" >
      <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/ministries" text="Ministries" />
          <IoIosArrowForward/>
          <Title text='Sessions' />
      </div>
      <Sessions/>
    </div>
  )
}

export default MinistrySession