import PrintBage from "@/components/features/badges/print/PrintBage"
import Subtitle from "@/components/features/Subtitle"
import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"

const page = () => {
  return (
    <div className="flex flex-col gap-6 p-4 pl-8 xl:pl-4 relative" >
        <div className="flex flex-row items-baseline gap-2">
            <Title clickable link='/dashboard/events/badges' text='Badges' />
            <IoIosArrowForward/>
            <Title link='/dashboard/events/badges/new' clickable text='New Badge' />
            <IoIosArrowForward/>
            <Title text='Print' />
        </div>

        <div className="flex flex-col w-full">
            <div className="flex bg-white p-6 w-full shadow-lg dark:bg-black border">
                <Subtitle text="Badge Details" />
            </div>
            <PrintBage/>
        </div>
        {/* <div className="flex flex-col md:flex-row"></div> */}
    </div>
  )
}

export default page