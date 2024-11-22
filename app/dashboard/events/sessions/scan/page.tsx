import Title from "@/features/Title"
import Scanner from "@/pages/session/Scanner"
import { IoIosArrowForward } from "react-icons/io"

const page = () => {
  return (
    <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
         <div className="flex flex-row items-baseline gap-2">
            <Title clickable link='/dashboard/events/sessions' text='Sessions' />
            <IoIosArrowForward/>
            <Title text='Attendance' />
        </div>
        <Scanner/>
    </div>
  )
}

export default page