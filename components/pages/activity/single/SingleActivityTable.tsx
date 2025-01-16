'use client'

import { IActivity } from "@/lib/database/models/activity.model";
import { IMember } from "@/lib/database/models/member.model";
import { useEffect, useState } from "react";
import NewActivityDown from "../new/NewActivityDown";
import SingleActMemberTable from "./SingleActMemberTable";
import { useSearchParams } from "next/navigation";
import SingleActLeaderTable from "./SingleActLeaderTable";

type SingleActivityTableProps = {
    activity:IActivity
}
type tabProps = 'Details' | 'Leaders' | 'Members'
const SingleActivityTable = ({activity}:SingleActivityTableProps) => {
    const [tab, setTab] = useState<tabProps>('Details');
    

    const searchParam = useSearchParams();

    const titles = ['Details', 'Members', 'Leaders'];
    const members = activity?.members as IMember[];
    const leaders = activity?.leaders as IMember[];

    useEffect(()=>{
        const title = searchParam.get('tab') as tabProps;
        if(title){
            setTab(title);
        }
    },[searchParam])


  return (
    <div className='flex flex-col p-5 rounded gap-4 bg-white dark:bg-transparent dark:border' >
        <div className="flex gap-3">
            {
                titles?.map((item)=>(
                    <div onClick={()=>setTab(item as tabProps)} key={item}  className={`${tab === item && 'border-b-2 rounded-b border-blue-700 dark:border-white'} flex p-1 font-bold cursor-pointer`}>
                        <span>{item}</span>
                    </div>
                ))
            }
        </div>
        {
            tab === 'Details' &&
            <NewActivityDown activity={activity} />
        }
        {
            tab === 'Members' &&
            <SingleActMemberTable members={members} activity={activity} />
        }
        {
            tab === 'Leaders' &&
            <SingleActLeaderTable leaders={leaders} activity={activity} />
        }
    </div>
  )
}

export default SingleActivityTable