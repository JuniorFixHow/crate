import Title from "@/components/features/Title"
import MRegisteration from "@/components/misc/MRegisteration";
import { IoIosArrowForward } from "react-icons/io";

const NewMember = () => {
  // console.log(params.id)
  return (
    <div className="p-4 pl-8 xl:pl-4 flex flex-col gap-4" >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
          <Title className="hidden md:block" clickable link="/dashboard/members" text="Member Registration" />
          <IoIosArrowForward className="hidden md:block" />
          <Title text="Add new member" />
        </div>
      </div>

      <div className="flex flex-col">
        <MRegisteration/>
      </div>
    </div>
  )
}

export default NewMember