import { getActivities, getActivitiesForChurch, getActivitiesForChurchMinistry, getChurchMembersAvailableForNewMinistry, getChurchMembersForMinistry } from "@/lib/actions/activity.action";
import { IActivity } from "@/lib/database/models/activity.model";
import { IMember } from "@/lib/database/models/member.model";
// import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";

export const useFetchActivities = () => {
    const {user} = useAuth();

    const fetchActivities = async():Promise<IActivity[]>=>{
        try {
            if(!user){
                return [];
            }

            const isAdmin = checkIfAdmin(user);
            const response:IActivity[] = isAdmin ? 
            await getActivities()
            :
            await getActivitiesForChurch(user.churchId);
            const sorted = response.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1)
           
            return sorted;

        } catch (error) {
         console.log(error);
         return [];   
        }
    }


    const  {
        data:activities=[], 
        isPending:loading, 
        refetch
    } = useQuery({
        queryKey:['activities'],
        queryFn:fetchActivities,
        enabled:!!user
    })

    return { 
        activities, loading, refetch, 
    };
};


export const useFetchMembersForActivity = (classId:string)=>{
    const fetchMembersForActivity = async():Promise<IMember[]> =>{
        try {
            if(!classId) return [];
            const response:IMember[] =  await getChurchMembersForMinistry(classId);
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    const {data:members=[], isPending, refetch} = useQuery({
        queryKey:['actmembers', classId],
        queryFn:fetchMembersForActivity,
        enabled:!!classId
    })

    return { members, isPending, refetch}
}


export const useFetchMembersForNewClass = (activityId:string)=>{
    const fetchMembersForActivity = async():Promise<IMember[]> =>{
        try {
            if(!activityId) return [];
            const response:IMember[] =  await getChurchMembersAvailableForNewMinistry(activityId);
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    const {data:members=[], isPending, refetch} = useQuery({
        queryKey:['membersfornewclass', activityId],
        queryFn:fetchMembersForActivity,
        enabled:!!activityId
    })

    return { members, isPending, refetch}
}


export const useFetchActivitiesForMinistry=(minId:string)=>{
    const fetchActivitiesForMinistry = async():Promise<IActivity[]> =>{
        try {
            if(!minId) return [];
            const response:IActivity[] =  await getActivitiesForChurchMinistry(minId);
            // console.log(response);
            return response||[];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:activities=[], isPending, refetch, isSuccess, isFetched} = useQuery({
        queryKey:['minactv2', minId],
        queryFn:fetchActivitiesForMinistry,
        enabled: !!minId
    })

    return {activities, isPending, refetch, isSuccess, isFetched}
}