'use client'
import { getMinistriesForActivity } from "@/lib/actions/ministry.action";
import { IMinistry } from "@/lib/database/models/ministry.model";
import {  useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const useFetchMinistries =(activityId:string)=>{


    const {data, isPending, refetch} = useSuspenseQuery({
        queryKey:['ministries', activityId],
        queryFn:()=>getMinistriesForActivity(activityId),
    })


    return {data, isPending, refetch}
}

export const useFetchMinistriesV2 =(activityId:string)=>{

    const fetchClasses = async():Promise<IMinistry[]> =>{
        try {
            if(!activityId) return [];
            const response:IMinistry[] = await getMinistriesForActivity(activityId);
            return response;
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:ministries=[], isPending, refetch} = useQuery({
        queryKey:['ministriesV2', activityId],
        queryFn:fetchClasses,
        enabled:!!activityId
    })


    return {ministries, isPending, refetch}
}