'use client'
import { searchMemberInversed } from "@/functions/search";
import { useFetchMembers } from "@/hooks/fetch/useMember";
import { useState } from "react";
import LongSearchbar from "./LongSearchbar";
import Link from "next/link";
import BadgeSearchItemV2 from "./BadgeSearchItemV2";

const NewBadgeSearchV2 = () => {
    const [search, setSearch] = useState<string>('');
    const {members} = useFetchMembers();
    const searched = searchMemberInversed(search, members);
  return (
    <div className="flex flex-col">
        <div className='p-4 shadow-xl flex bg-white dark:bg-[#0F1214] border' >
            <LongSearchbar className='w-full' setSearch={setSearch} placeholder='type here to search for a member'  />
        </div>
        {
          search !== '' && searched.length <= 0  ?
          <Link className='table-link' href='/dashboard/members/new' > Create Member </Link>
          :
          <div className='p-4 shadow-xl flex-col gap-6 flex bg-white dark:bg-[#0F1214] border border-t-0' >
            {
              searchMemberInversed(search, members).map((member)=>(
                <BadgeSearchItemV2 
                    key={member._id}
                    // isRegisterItem={isRegisterItem}  
                    member={member} 
                />
              ))
            }
          </div>
        }
    </div>
  )
}

export default NewBadgeSearchV2