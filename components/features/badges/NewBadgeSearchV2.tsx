'use client'
import { searchMemberInversed } from "@/functions/search";
import { useFetchMembers } from "@/hooks/fetch/useMember";
import { useState } from "react";
import LongSearchbar from "./LongSearchbar";
import Link from "next/link";
import BadgeSearchItemV2 from "./BadgeSearchItemV2";
import AddButton from "../AddButton";
import { LiaTimesSolid } from "react-icons/lia";
import { IMember } from "@/lib/database/models/member.model";
import { useRouter } from "next/navigation";

const NewBadgeSearchV2 = () => {
    const [search, setSearch] = useState<string>('');
    const [selection, setSelection] = useState<IMember[]>([]);
    const {members} = useFetchMembers();
    const searched = searchMemberInversed(search, members);
    const router = useRouter();

    const handleSelect = (member:IMember)=>{
        setSelection((pre)=>{
            const isSelected = pre.find((item)=> item._id === member?._id);
            return isSelected ?
            pre.filter((item)=> item._id !== member?._id)
            :
            [...pre, member]
        })
    }

    const unselect = (member:IMember)=>{
        setSelection((pre)=>(
            pre.filter((item)=>item._id !== member._id)
        ))
    }

    const gotoPrint = ()=>{
        sessionStorage.setItem( 'printData',JSON.stringify(selection));
        router.push('/dashboard/events/badges/new/print');
    }
    // console.log(selection)

  return (
    <div className="flex flex-col">
        <div className='p-4 shadow-xl flex bg-white dark:bg-[#0F1214] border gap-4' >
            <LongSearchbar className='grow' setSearch={setSearch} placeholder='type here to search for a member'  />
            {
                selection.length > 0 &&
                <AddButton onClick={gotoPrint} text="Proceed" smallText noIcon className='rounded-full py-2 px-4' />
            }
        </div>

        <hr className='w-full border-slate-300' />

        <div className="flex flex-col gap-4 bg-white dark:bg-transparent dark:border p-4">
            <div className="flex flex-wrap gap-6 w-full">
                {
                    selection?.map((member)=>(
                        <div onClick={()=>unselect(member)} key={member?._id} className="flex gap-1 p-2 items-center rounded-full bg-slate-400 cursor-pointer">
                            <span>{member?.name}</span>
                            <LiaTimesSolid className='dark:text-white text-red-700' size={18} />
                        </div>
                    ))
                }
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
                        selection={selection}
                        // isRegisterItem={isRegisterItem}  
                        member={member}
                        handleSelect={handleSelect} 
                    />
                ))
                }
            </div>
            }
        </div>

    </div>
  )
}

export default NewBadgeSearchV2