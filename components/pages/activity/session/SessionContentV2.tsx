import { IClasssession } from "@/lib/database/models/classsession.model"
import SessionContentTopV2 from "./SessionTopV2"
import AttendanceTableV2 from "./AttendanceTableV2"
import NoSessions from "./NoSessions";

type SessionContentV2Props = {
    currentSession:IClasssession|null,
    classId:string;
    isLoading:boolean
}

const SessionContentV2 = ({currentSession, isLoading, classId}:SessionContentV2Props) => {
  return (
    <div className='flex flex-col gap-3' >
      <SessionContentTopV2 currentSession={currentSession!} ministryId={classId}  />
        {
            currentSession ?
            <AttendanceTableV2 currentSession={currentSession!} />
            :
            <NoSessions loading={isLoading} />
        }
    </div>
  )
}

export default SessionContentV2