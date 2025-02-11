'use client';

import AddButton from "@/components/features/AddButton";
// import Subtitle from "@/components/features/Subtitle";
import Title from "@/components/features/Title"
import MDetails from "@/components/misc/MDetails";
import NewRelationship from "@/components/misc/NewRelationship";
// import { useFetchMemberRelationships } from "@/hooks/fetch/useRelationship";
import { IMember } from "@/lib/database/models/member.model";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import SingleRelationshipTable from "./relationships/singleRelationship/SingleRelationshipTable";
import { useFetchMemberRelationships } from "@/hooks/fetch/useRelationship";

type SingleMemberMainProps = {
    member:IMember
}

const SingleMemberMain = ({member}:SingleMemberMainProps) => {
  const [infoMode, setInfoMode] = useState<boolean>(false);
  const [tab, setTab] = useState<string>('Member Details');
  const {relationships, isPending, refetch} = useFetchMemberRelationships(member?._id);
  const tabs = relationships?.length ? ['Member Details', 'Relationships'] :['Member Details'];
  

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

      <NewRelationship fixedSelection={[member]} infoMode={infoMode} setInfoMode={setInfoMode} />

      <div className="flex flex-col">
        <div className="flex justify-between dark:bg-black dark:border border-b border-b-slate-300 flex-row w-full px-8 py-4 bg-white">
          <div className="flex gap-4">
            {
              tabs.map((item)=>(
                <div key={item} onClick={()=>setTab(item)} className={`flex cursor-pointer ${tab===item && 'border-b-2 border-b-blue-500 rounded-b px-2'}`}>
                  <span className={`font-bold hover:text-black ${item === tab ? 'text-slate-900 dark:text-white':'text-slate-400 dark:text-slate-600'}`} >{item}</span>
                </div>
              ))
            }
          </div>
          {/* <Subtitle text="Member Details" /> */}
          {
            tab === 'Member Details' &&
            <AddButton onClick={()=>setInfoMode(true)}  className="rounded" smallText noIcon text="New Relationship" />
          }
        </div>
        {
          tab === 'Member Details' ?
          <MDetails currentMember={member} />
          :
          <SingleRelationshipTable member={member} relationships={relationships} refetch={refetch} isPending={isPending} />
        }
      </div>
    </div>
  )
}

export default SingleMemberMain