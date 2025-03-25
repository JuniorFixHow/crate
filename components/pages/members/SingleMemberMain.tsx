'use client';

import AddButton from "@/components/features/AddButton";
// import Subtitle from "@/components/features/Subtitle";
import Title from "@/components/features/Title"
import MDetails from "@/components/misc/MDetails";
import NewRelationship from "@/components/misc/NewRelationship";
// import { useFetchMemberRelationships } from "@/hooks/fetch/useRelationship";
import { IMember } from "@/lib/database/models/member.model";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import SingleRelationshipTable from "./relationships/singleRelationship/SingleRelationshipTable";
import { useFetchMemberRelationships } from "@/hooks/fetch/useRelationship";
import { useAuth } from "@/hooks/useAuth";
import { canPerformAction, memberRoles, relationshipRoles } from "@/components/auth/permission/permission";
import { useRouter } from "next/navigation";

type SingleMemberMainProps = {
    member:IMember
}

const SingleMemberMain = ({member}:SingleMemberMainProps) => {
  const [infoMode, setInfoMode] = useState<boolean>(false);
  const [tab, setTab] = useState<string>('Member Details');
  const {relationships, isPending, refetch} = useFetchMemberRelationships(member?._id);
  const tabs = relationships?.length ? ['Member Details', 'Relationships'] :['Member Details'];

  const router = useRouter();
  
  const {user} = useAuth();
  // const isAdmin = checkIfAdmin(user);
  const showRel = canPerformAction(user!, 'admin', {relationshipRoles});
  const showAdd = canPerformAction(user!, 'creator', {memberRoles});
  const showRelAdd = canPerformAction(user!, 'updater', {memberRoles}) || canPerformAction(user!, 'creator', {relationshipRoles});
  const reader = canPerformAction(user!, 'reader', {memberRoles});

  useEffect(()=>{
    if(user && (!reader)){
      router.replace('/dashboard/forbidden?p=Member Reader')
    }
  },[reader, user, router])

  if(!reader) return;
  
  
  return (
    <div className="page" >
        <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/members" text="Member Registration"  className="hidden md:block" />
          <IoIosArrowForward className="hidden md:block" />
          <Title text="Member Info" />
        </div>
        {
          showAdd &&
          <Link className="w-fit" href='/dashboard/members/new' >
            <AddButton text='Add Member' className="w-fit rounded" />
          </Link>
        }
      </div>

      <NewRelationship refetch={refetch} fixedSelection={[member]} infoMode={infoMode} setInfoMode={setInfoMode} />

      <div className="flex flex-col">
        <div className="flex items-start md:items-center justify-between dark:bg-black dark:border border-b border-b-slate-300 flex-row w-full px-8 py-4 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            {
              tabs
              .filter((item)=>showRel ? item:item!== 'Relationships')
              .map((item)=>(
                <div key={item} onClick={()=>setTab(item)} className={`flex cursor-pointer ${tab===item && 'border-b-2 border-b-blue-500 rounded-b px-2'}`}>
                  <span className={`font-bold hover:text-black ${item === tab ? 'text-slate-900 dark:text-white':'text-slate-400 dark:text-slate-600'}`} >{item}</span>
                </div>
              ))
            }
          </div>
          {/* <Subtitle text="Member Details" /> */}
          {
            tab === 'Member Details' && showRelAdd &&
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