import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import NewSessionsV2 from "./NewSessionsV2"

const NewSessionsMain = () => {
  return (
    <div className="page" >
      <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/ministries" text="Ministries"  className="hidden md:block" />
          <IoIosArrowForward className="hidden md:block" />
          <Title link="/dashboard/ministries/sessions" clickable text='Sessions' />
          <IoIosArrowForward/>
          <Title  text='New' />
      </div>
      <NewSessionsV2/>
    </div>
  )
}

export default NewSessionsMain