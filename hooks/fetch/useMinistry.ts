'use client'
import { getMinistriesForActivity } from "@/lib/actions/ministry.action";
import {  useSuspenseQuery } from "@tanstack/react-query";

export const useFetchMinistries =(activityId:string)=>{

    

    const {data, isPending, refetch} = useSuspenseQuery({
        queryKey:['ministries', activityId],
        queryFn:()=>getMinistriesForActivity(activityId),
    })


    return {data, isPending, refetch}
}