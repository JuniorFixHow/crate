import { IMember } from "@/lib/database/models/member.model"
import Link from "next/link"
import { ComponentProps, useState } from "react"
import Subtitle from "../Subtitle"
import { MdOutlineEmail } from "react-icons/md"
import { FaPhone } from "react-icons/fa"
import { IoMdGlobe } from "react-icons/io"
import AddButton from "../AddButton"
import { IChurch } from "@/lib/database/models/church.model"
import { IZone } from "@/lib/database/models/zone.model"

type BadgeSearchItemV2Props = {
    member:IMember
} & ComponentProps<'div'>
const BadgeSearchItemV2 = ({member, className, ...props}:BadgeSearchItemV2Props) => {
    const [selection, setSelection] = useState<string[]>([]);
    const church = member?.church as IChurch;
    const zone = church?.zoneId as IZone;

    const handleSelect = ()=>{
        setSelection((pre)=>{
            const isSelected = pre.find((item)=> item !== member?._id);
            return isSelected ?
            pre.filter((item)=> item !== member?._id)
            :
            [...pre, member?._id]
        })
    }

  return (
    <div {...props} className={`${className} flex w-full flex-col gap-4 md:flex-row dark:bg-[#0F1214] justify-between items-start md:items-center bg-[#d6d6d6] p-2 rounded border-slate-400 border`} >
        <div className="flex flex-col gap-2">
            <Link className="table-link" href={`/dashboard/members/${member?._id}`} >
                <Subtitle isLink text={member?.name} />
            </Link>
            <div className="flex flex-row gap-1 items-center">
                <MdOutlineEmail className="text-slate-500" />
                <span className="text-[0.7rem] text-slate-500" >{member?.email}</span>
            </div>
            <div className="flex flex-row gap-1 items-center">
                <FaPhone size={14}  className="text-slate-500" />
                <span className="text-[0.7rem] text-slate-500" > {member?.phone}</span>
            </div>
            <div className="flex flex-row gap-1 items-center">
                <IoMdGlobe size={14}  className="text-slate-500" />
                <span className="text-[0.7rem] text-slate-500" >{church?.name} - {zone?.name}</span>
            </div>
        </div>

            <AddButton onClick={handleSelect} text={selection.includes(member?.id) ? 'Unselect':'Select'} noIcon smallText className="rounded w-fit justify-center" />
        {/* <Link className="flex self-end md:self-center" href={{pathname:'/dashboard/events/badges/new/print', query:{memberId:member._id}}} >
        </Link> */}
    </div>
  )
}

export default BadgeSearchItemV2