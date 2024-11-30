'use client'
import AddButton from "../AddButton"
import Subtitle from "../Subtitle"
import { MdOutlineEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { PiUserLight } from "react-icons/pi";
import { ComponentProps, Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { IMember } from "@/lib/database/models/member.model";
import { ErrorProps } from "@/types/Types";
import { addMemberToGroup } from "@/lib/actions/group.action";
import { IGroup } from "@/lib/database/models/group.model";

export type BadgeSearchItemProps = {
    member:IMember,
    setResponse?:Dispatch<SetStateAction<ErrorProps>>,
    currentGroup?:IGroup
    isGroupItem?:boolean
} & ComponentProps<'div'>

const BadgeSearchItem = ({member, setResponse, currentGroup,  isGroupItem, ...props}:BadgeSearchItemProps ) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleAddToGroup = async()=>{
        setResponse!(null);
        try {
            setLoading(true);
            if(currentGroup){
                const eventId = typeof currentGroup?.eventId === 'object' && '_id' in currentGroup?.eventId && currentGroup?.eventId._id;
                const res:ErrorProps =  await addMemberToGroup(currentGroup._id, member._id, eventId.toString());
                setResponse!(res);
            }
        } catch (error) {
            console.log(error);
            setResponse!({message:'Error occured add member to group', error:true})
        }finally{
            setLoading(false);
        }
    }
   
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
            <AddButton disabled={loading} onClick={handleAddToGroup} text={loading ? "adding...":"Add to group"} noIcon smallText className="rounded w-fit justify-center py-1 md:py-2 self-end md:self-center" />
            :
            <Link className="flex self-end md:self-center" href={{pathname:'/dashboard/events/badges/new/print', query:{memberId:member._id}}} >
                <AddButton text="Open" noIcon smallText className="rounded w-fit justify-center" />
            </Link>
        }
    </div>
  )
}

export default BadgeSearchItem