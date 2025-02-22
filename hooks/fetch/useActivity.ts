import { getActivities, getActivitiesForChurch, getActivitiesForChurchMinistry, getChurchMembersForMinistry } from "@/lib/actions/activity.action";
import { IActivity } from "@/lib/database/models/activity.model";
import { IMember } from "@/lib/database/models/member.model";
// import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useFetchActivities = (classId?:string, minId?:string) => {
    // const [activities, setActivities] = useState<IActivity[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);
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

           
            return response.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1)||[];

        } catch (error) {
         console.log(error);
         return [];   
        }
    }

    const fetchMembersForActivity = async():Promise<IMember[]> =>{
        try {
            if(!classId) return [];
            const response:IMember[] =  await getChurchMembersForMinistry(classId);
            return response||[];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

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

    const [
        {
            data:activities, 
            isPending:loading, 
            refetch
        },
        {
            data:members, isPending, refetch:reload
        },
        {
            data:acts, isPending:inprogress, refetch:refresh
        }
    ] = useQueries({
        queries:[
            {
                queryKey:['activities'],
                queryFn:fetchActivities,
                enabled:!!user
            },
            {
                queryKey:['actmembers', classId],
                queryFn:fetchMembersForActivity,
                enabled:!!classId
            },
            {
                queryKey:['actmin', minId],
                queryFn:fetchActivitiesForMinistry,
                enabled:!!minId
            }
        ]
    })

    return { 
        activities, loading, refetch, 
        members, reload, isPending,
        acts, inprogress, refresh 
    };
};


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