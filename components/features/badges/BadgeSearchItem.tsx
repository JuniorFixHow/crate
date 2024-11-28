'use client'
import AddButton from "../AddButton"
import Subtitle from "../Subtitle"
import { MdOutlineEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { PiUserLight } from "react-icons/pi";
import { ComponentProps } from "react";
import Link from "next/link";
import { IMember } from "@/lib/database/models/member.model";

export type BadgeSearchItemProps = {
    member:IMember,
    isGroupItem?:boolean
} & ComponentProps<'div'>

const BadgeSearchItem = ({member, isGroupItem, ...props}:BadgeSearchItemProps ) => {
   
  return (
    <div {...props}  className="flex w-full flex-col gap-4 md:flex-row dark:bg-black justify-between items-start md:items-center bg-[#d6d6d6] p-2 rounded border-slate-400 border" >
        <div className="flex flex-col gap-2">
            <Link href={`/dashboard/members/${member?._id}`} >
                <Subtitle isLink text={member.name} />
            </Link>
            <div className="flex flex-row gap-1 items-center">
                <MdOutlineEmail className="text-slate-500" />
                    <span className="text-[0.7rem] text-slate-500" >{member.email}</span>
            </div>
            <div className="flex flex-row gap-1 items-center">
                <FaPhone size={14}  className="text-slate-500" />
                <span className="text-[0.7rem] text-slate-500" > {member?.phone}</span>
            </div>
            <div className="flex flex-row gap-1 items-center">
                <PiUserLight size={14}  className="text-slate-500" />
                <span className="text-[0.7rem] text-slate-500" >{member.status}</span>
            </div>
        </div>
        {
            isGroupItem ?
            <AddButton text="Add to group" noIcon smallText className="rounded w-fit justify-center py-1 md:py-2 self-end md:self-center" />
            :
            <Link className="flex self-end md:self-center" href={{pathname:'/dashboard/events/badges/new/print', query:{memberId:member._id}}} >
                <AddButton text="Open" noIcon smallText className="rounded w-fit justify-center" />
            </Link>
        }
    </div>
  )
}

export default BadgeSearchItem