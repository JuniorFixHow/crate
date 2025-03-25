'use client'
import { getMinistriesForActivity } from "@/lib/actions/ministry.action";
import { IMinistry } from "@/lib/database/models/ministry.model";
import {  useQuery } from "@tanstack/react-query";

export const useFetchMinistries =(activityId:string)=>{
    const fetchMinistry = async():Promise<IMinistry[]>=>{
        try {
            if(!activityId) return [];
            const res:IMinistry[] = await getMinistriesForActivity(activityId);
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data=[], isPending, refetch} = useQuery({
        queryKey:['ministries', activityId],
        queryFn:fetchMinistry,
        enabled:!!activityId
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