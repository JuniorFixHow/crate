import Title from "@/components/features/Title"
import { IClassministry } from "@/lib/database/models/classministry.model"
import { IoIosArrowForward } from "react-icons/io"
import SingleMinistryTable from "./SingleMinistryTable"

type SingleMinistryMainProps = {
    currentClassministry:IClassministry
}

const SingleMinistryMain = ({currentClassministry}:SingleMinistryMainProps) => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/ministries" text="Ministries" />
            <IoIosArrowForward/>
            <Title text={currentClassministry?.title} />
        </div>
        <SingleMinistryTable currentClassministry={currentClassministry} />
    </div>
  )
}

export default SingleMinistryMain