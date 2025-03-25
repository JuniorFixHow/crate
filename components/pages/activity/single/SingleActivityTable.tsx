'use client'

import { IMember } from "@/lib/database/models/member.model";
import { useEffect, useState } from "react";
import NewActivityDownV2 from "../new/NewActivityDownV2";
import SingleActMemberTable from "./SingleActMemberTable";
import { useRouter, useSearchParams } from "next/navigation";
import SingleActLeaderTable from "./SingleActLeaderTable";
import Link from "next/link";
import AddButton from "@/components/features/AddButton";
import { IMinistry } from "@/lib/database/models/ministry.model";
import { IActivity } from "@/lib/database/models/activity.model";
import SearchSelectClassesV2 from "@/components/features/SearchSelectClassesV2";
import {  useQuery } from "@tanstack/react-query";
import { deleteMinistry, getMinistry } from "@/lib/actions/ministry.action";
import {  useFetchMinistriesV2 } from "@/hooks/fetch/useMinistry";
import NewActivityDownV4 from "../new/NewActivityDownV4";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { ErrorProps } from "@/types/Types";
import DeleteDialog from "@/components/DeleteDialog";
import { Alert, LinearProgress } from "@mui/material";
import { activityRoles, canPerformAction, classRoles } from "@/components/auth/permission/permission";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { enqueueSnackbar } from "notistack";

type SingleActivityTableProps = {
    activity:IActivity,
}
type tabProps = 'Details' | 'Leaders' | 'Members'
const SingleActivityTable = ({ activity}:SingleActivityTableProps) => {
    const {user} = useAuth();
    const [tab, setTab] = useState<tabProps>('Details');
    const [ministryId, setMinistryId] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [ministry, setMinistry] = useState<IMinistry|null>(null);
    const updater = canPerformAction(user!, 'updater', {activityRoles});
    const reader = canPerformAction(user!, 'reader', {activityRoles});
    const classCreator = canPerformAction(user!, 'creator', {classRoles});
    const classReader = canPerformAction(user!, 'reader', {classRoles});
    const classDeleter = canPerformAction(user!, 'deleter', {classRoles});
    const classUpdater = canPerformAction(user!, 'updater', {classRoles});

    const access = updater || reader;

    const searchParam = useSearchParams();

    const titles = ['Details', 'Members', 'Leaders'];
    const {ministries, refetch} = useFetchMinistriesV2(activity?._id);
    const [response, setResponse] = useState<ErrorProps>(null);
    // console.log(ministries)
    const router = useRouter();
    
    useEffect(()=>{
        if(user && (!reader && !updater)){
            router.replace('/dashboard/forbidden?p=Activity Reader')
        }
    },[user, reader, updater, router]);

    const {data, isPending, refetch:reload} = useQuery({
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

    useEffect(()=>{
        const classId = searchParam.get('classId');
        if(classId){
            setMinistryId(classId)
        }
    },[searchParam])

    const handleDeleteMinistry = async()=>{
        try {
            const res = await deleteMinistry(ministryId);
            // setResponse(res);
            setDeleteMode(false);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            refetch();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting the class', {variant:'error'});
        }
    }

    const mini = ministries?.find((item:IMinistry)=>item._id === ministryId);

    const message = `Are you sure you want to delete '${mini?.name}' class?`;

    if(!access) return;

  return (
    <div className='flex flex-col p-5 rounded gap-4 bg-white dark:bg-transparent dark:border' >
        {
            response?.message &&
            <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response?.message}</Alert>
        }
        <div className="flex w-full">
            {
                isPending && ministries.length > 0 &&
                <LinearProgress className="w-full" />
            }
        </div>
        <div className="flex flex-col gap-5 md:flex-row justify-between">
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
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex gap-5 items-center">
                    {
                        data && tab !== 'Details' &&
                        <div className="flex flex-row gap-4">
                            {
                                (classReader || reader || updater) &&
                                <GoInfo onClick={()=>setEditMode(true)}  className="cursor-pointer text-green-700" />
                            }
                            {
                                classDeleter &&
                                <IoTrashBinOutline onClick={()=>setDeleteMode(true)}  className="cursor-pointer text-red-700" />
                            }
                        </div>  
                    }
                    <SearchSelectClassesV2 value={mini?.name} activityId={activity?._id} setSelect={setMinistryId} />
                </div>
                {
                    (classCreator || updater) &&
                    <Link href={`/dashboard/activities/${activity?._id}/new`} >
                        <AddButton text="New Class" noIcon smallText className="py-2 rounded" />
                    </Link>
                }
            </div>
        </div>
        
        <DeleteDialog 
            title="Delete Class" 
            message={message}
            onTap={handleDeleteMinistry}
            value={deleteMode} setValue={setDeleteMode}
        />
        <NewActivityDownV4 updater={classUpdater || updater} ministry={data as IMinistry} editMode={editMode} setEditMode={setEditMode} />

        {
            tab === 'Details' &&
            <NewActivityDownV2 updater={updater} activity={activity} />
        }
        {
            tab === 'Members' && members &&
            <SingleActMemberTable reload={reload} updater={updater} members={members} ministry={data as IMinistry} />
        }
        {
            tab === 'Leaders' && leaders &&
            <SingleActLeaderTable reload={reload} updater={updater} leaders={leaders} ministry={data as IMinistry} />
        }
    </div>
  )
}

export default SingleActivityTable