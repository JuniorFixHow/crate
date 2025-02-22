import Title from "@/components/features/Title"
import EditSession from "@/components/pages/session/EditSession"
import { getSession } from "@/lib/actions/session.action";
import { IoIosArrowForward } from "react-icons/io"

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const currentSession = await getSession(id);
  return (
    <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
        <div className="flex flex-row items-baseline gap-2">
            <Title clickable link='/dashboard/events/sessions' text='Sessions' />
            <IoIosArrowForward/>
            <Title text='Edit Session' />
        </div>
        <EditSession currentSession={currentSession} />
    </div>
  )
}

export default page