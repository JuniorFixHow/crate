'use client'

import { IMember } from "@/lib/database/models/member.model";
import { useEffect, useState } from "react";
import NewActivityDownV2 from "../new/NewActivityDownV2";
import SingleActMemberTable from "./SingleActMemberTable";
import { useSearchParams } from "next/navigation";
import SingleActLeaderTable from "./SingleActLeaderTable";
import Link from "next/link";
import AddButton from "@/components/features/AddButton";
import { IMinistry } from "@/lib/database/models/ministry.model";
import { IActivity } from "@/lib/database/models/activity.model";
import SearchSelectClass from "@/components/features/SearchSelectClass";
import { useQuery } from "@tanstack/react-query";
import { deleteMinistry, getMinistry } from "@/lib/actions/ministry.action";
import { useFetchMinistries } from "@/hooks/fetch/useMinistry";
import NewActivityDownV4 from "../new/NewActivityDownV4";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { ErrorProps } from "@/types/Types";
import DeleteDialog from "@/components/DeleteDialog";
import { Alert } from "@mui/material";

type SingleActivityTableProps = {
    activity:IActivity,
}
type tabProps = 'Details' | 'Leaders' | 'Members'
const SingleActivityTable = ({ activity}:SingleActivityTableProps) => {
    const [tab, setTab] = useState<tabProps>('Details');
    const [ministryId, setMinistryId] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [ministry, setMinistry] = useState<IMinistry|null>(null);
    

    const searchParam = useSearchParams();

    const titles = ['Details', 'Members', 'Leaders'];
    const ministries = useFetchMinistries(activity?._id)?.data;
    const [response, setResponse] = useState<ErrorProps>(null);
    // console.log(ministries)
    
    const {data} = useQuery({
        queryKey:['ministry', ministryId],
        queryFn: ()=>getMinistry(ministryId),
        enabled: !!ministryId
    })

    // console.log(data);

    const members = (data as IMinistry)?.members as IMember[];
    const leaders = (data as IMinistry )?.leaders as IMember[];

    useEffect(()=>{
        const title = searchParam.get('tab') as tabProps;
        if(title){
            setTab(title);
        }
    },[searchParam])

    const handleDeleteMinistry = async()=>{
        try {
            const res = await deleteMinistry(ministryId);
            setResponse(res);
            setDeleteMode(false);
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured deleting the class', error:true});
        }
    }

    const message = `Are you sure you want to delete this class?`;

  return (
    <div className='flex flex-col p-5 rounded gap-4 bg-white dark:bg-transparent dark:border' >
        {
            response?.message &&
            <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response?.message}</Alert>
        }
        <div className="flex justify-between items-end">
            {
                ministries?.length > 0 &&
                <div className="flex gap-3">
                    {
                        titles?.map((item)=>{
                            const show = item === 'Details';
                            // const others = item === 'Members' || item === 'Leaders';
                            return show || ministries?.length > 0 ? 
                            <div onClick={()=>setTab(item as tabProps)} key={item}  className={`${tab === item && 'border-b-2 rounded-b border-blue-700 dark:border-white'} flex p-1 font-bold cursor-pointer`}>
                                <span>{item}</span>
                            </div>
                           :
                           null
                        })
                    }
                </div>
            }
            <div className="flex items-end gap-4">
                {
                    data && tab !== 'Details' &&
                    <div className="flex flex-row gap-4 h-6">
                        <GoInfo onClick={()=>setEditMode(true)}  className="cursor-pointer text-green-700" />
                        <IoTrashBinOutline onClick={()=>setDeleteMode(true)}  className="cursor-pointer text-red-700" />
                    </div>  
                }
                <SearchSelectClass isGeneric activityId={activity?._id} setSelect={setMinistryId} />
                <Link href={`/dashboard/activities/${activity?._id}/new`} >
                    <AddButton text="New Class" noIcon smallText className="py-1 rounded" />
                </Link>
            </div>
        </div>
        
        <DeleteDialog 
            title="Delete Class" 
            message={message}
            onTap={handleDeleteMinistry}
            value={deleteMode} setValue={setDeleteMode}
        />
        <NewActivityDownV4 ministry={data as IMinistry} editMode={editMode} setEditMode={setEditMode} />

        {
            tab === 'Details' &&
            <NewActivityDownV2 activity={activity} />
        }
        {
            tab === 'Members' &&
            <SingleActMemberTable members={members} ministry={data as IMinistry} />
        }
        {
            tab === 'Leaders' &&
            <SingleActLeaderTable leaders={leaders} ministry={data as IMinistry} />
        }
    </div>
  )
}

export default SingleActivityTable