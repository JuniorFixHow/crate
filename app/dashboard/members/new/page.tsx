import Title from "@/features/Title"
import MRegisteration from "@/misc/MRegisteration";
import { IoIosArrowForward } from "react-icons/io";

const NewMember = () => {
  // console.log(params.id)
  return (
    <div className="p-4 pl-8 xl:pl-4 flex flex-col gap-4" >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
          <Title clickable link="/dashboard/members" text="Member Registration" />
          <IoIosArrowForward/>
          <Title text="Add new member" />
        </div>
      </div>

      <div className="flex flex-col">
        {/* <div className="flex dark:bg-black dark:border border-b border-b-slate-300 flex-col w-full px-8 py-4 bg-white">
          <Subtitle text="Member Details" />
        </div> */}
        {/* <MDetails id={params?.id} /> */}
        <MRegisteration/>
      </div>
    </div>
  )
}

export default NewMember