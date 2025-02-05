import Title from "@/components/features/Title"
import { IClassministry } from "@/lib/database/models/classministry.model"
import { IoIosArrowForward } from "react-icons/io"

type SingleMinistryMainProps = {
    currentClassministry:IClassministry
}

const SingleMinistryMain = ({currentClassministry}:SingleMinistryMainProps) => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/ministries" text="Activities" />
            <IoIosArrowForward/>
            <Title text={currentClassministry?.title} />
        </div>
    </div>
  )
}

export default SingleMinistryMain