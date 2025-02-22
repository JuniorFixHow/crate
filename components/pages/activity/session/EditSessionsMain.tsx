import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import { IClasssession } from "@/lib/database/models/classsession.model"
import EditSessionsV2 from "./EditSessionsV2"

type EditSessionsMainProps = {
  currentSession:IClasssession
}

const EditSessionsMain = ({currentSession}:EditSessionsMainProps) => {
  return (
    <div className="page" >
      <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/ministries" text="Ministries" />
          <IoIosArrowForward/>
          <Title link="/dashboard/ministries/sessions" clickable text='Sessions' />
          <IoIosArrowForward/>
          <Title  text={currentSession?.name ?? 'Edit'} />
      </div>
      <EditSessionsV2 currentSession={currentSession} />
    </div>
  )
}

export default EditSessionsMain