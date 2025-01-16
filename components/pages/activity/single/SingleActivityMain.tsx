import Title from "@/components/features/Title"
import { IActivity } from "@/lib/database/models/activity.model"
import { IoIosArrowForward } from "react-icons/io"
import SingleActivityTable from "./SingleActivityTable"

type SingleActivityMainProps = {
    currentActivity:IActivity
}

const SingleActivityMain = ({currentActivity}:SingleActivityMainProps) => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/activities" text="Activities" />
            <IoIosArrowForward/>
            <Title text={currentActivity?.name} />
        </div>
        <SingleActivityTable activity={currentActivity} />
    </div>
  )
}

export default SingleActivityMain