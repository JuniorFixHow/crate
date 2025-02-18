'use client'
import {  searchMemberInversedV2  } from "@/functions/search";
import {  useFetchMembersInAChurchV2 } from "@/hooks/fetch/useMember";
import { useState } from "react";
import LongSearchbar from "./LongSearchbar";
import Link from "next/link";
import BadgeSearchItemV2 from "./BadgeSearchItemV2";
import AddButton from "../AddButton";
import { LiaTimesSolid } from "react-icons/lia";
import { IMember } from "@/lib/database/models/member.model";
import { useRouter } from "next/navigation";
import SearchSelectChurchesV2 from "../SearchSelectChurchesV2";
import { MdChecklist } from "react-icons/md";
import { LuCopyX } from "react-icons/lu";

const NewBadgeSearchV2 = () => {
    const [search, setSearch] = useState<string>('');
    const [selection, setSelection] = useState<IMember[]>([]);
    const {members} = useFetchMembersInAChurchV2();
    // const [title, setTitle] = useState<string>('Members');
    const [churchId, setChurchId] = useState<string>('');
    const searched = searchMemberInversedV2(search, churchId, members as IMember[]);
    const router = useRouter();
    
    
    // const titles = ['Members', 'Churches'];
    console.log('Church: ', churchId);

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
        <div className='p-4 shadow-xl flex-col flex bg-white dark:bg-[#0F1214] border gap-4' >
            <div className="flex flex-col gap-4 md:flex-row items-center justify-between">
                <SearchSelectChurchesV2 setSelect={setChurchId} />
                {
                    searched?.length > 0 &&
                    <div className="flex gap-4 items-center">
                        <div onClick={()=>setSelection(searched)}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                            <div className="flex-center p-1 bg-slate-400 rounded-full">
                                <MdChecklist />
                            </div>
                            <span className="dark:text-black text-sm" >Select All</span>
                        </div>
                        <div onClick={()=>setSelection([])}  className="flex gap-2 items-center dark:bg-white cursor-pointer bg-slate-200 rounded-lg px-4 py-2">
                            <div className="flex-center p-1 bg-slate-400 rounded-full">
                                <LuCopyX />
                            </div>
                            <span className="dark:text-black text-sm" >Cancel Selections</span>
                        </div>
                        
                    </div>
                }

            </div>
            <div className="flex gap-4 items-center">
                <LongSearchbar className='grow' setSearch={setSearch} placeholder='type here to search for a member'  />
                {
                    selection?.length > 0 &&
                    <AddButton onClick={gotoPrint} text="Proceed" smallText noIcon className='rounded-full py-2 px-4' />
                }
            </div>
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
                searchMemberInversedV2(search, churchId, members as IMember[])?.map((member)=>(
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