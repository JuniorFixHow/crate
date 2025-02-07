import AddButton from "@/components/features/AddButton";
import Subtitle from "@/components/features/Subtitle";
import Title from "@/components/features/Title"
import MDetails from "@/components/misc/MDetails";
import { IMember } from "@/lib/database/models/member.model";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

type SingleMemberMainProps = {
    member:IMember
}

const SingleMemberMain = ({member}:SingleMemberMainProps) => {
  return (
    <div className="page" >
        <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/members" text="Member Registration" />
          <IoIosArrowForward/>
          <Title text="Member Info" />
        </div>
        <Link className="w-fit" href='/dashboard/members/new' >
          <AddButton text='Add Member' className="w-fit" />
        </Link>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between dark:bg-black dark:border border-b border-b-slate-300 flex-row w-full px-8 py-4 bg-white">
          <Subtitle text="Member Details" />
          <AddButton className="rounded" smallText noIcon text="New Relationship" />
        </div>
        <MDetails currentMember={member} />
      </div>
    </div>
  )
}

export default SingleMemberMain