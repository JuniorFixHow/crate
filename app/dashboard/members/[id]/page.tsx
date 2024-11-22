import AddButton from "@/features/AddButton";
import Subtitle from "@/features/Subtitle";
import Title from "@/features/Title"
import MDetails from "@/misc/MDetails";
import { IoIosArrowForward } from "react-icons/io";

const SingleMember = async({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params;
  // console.log(params.id)
  return (
    <div className="p-4 pl-8 xl:pl-4 flex flex-col gap-4" >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/members" text="Member Registration" />
          <IoIosArrowForward/>
          <Title text="Member Info" />
        </div>
        <AddButton text='Add Member' className="w-fit" />
      </div>

      <div className="flex flex-col">
        <div className="flex dark:bg-black dark:border border-b border-b-slate-300 flex-col w-full px-8 py-4 bg-white">
          <Subtitle text="Member Details" />
        </div>
        <MDetails id={id} />
      </div>
    </div>
  )
}

export default SingleMember