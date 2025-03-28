'use client'
import { getCYPSets, getCYPSetsForChurch, getCYPSetsForEvent, getPublicCYPSets } from "@/lib/actions/cypset.action";
import { ICYPSet } from "@/lib/database/models/cypset.model"
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import {  eventOrganizerRoles, isSuperUser, isSystemAdmin } from "@/components/auth/permission/permission";

export const useFetchCYPSet = ()=>{
    const {user} = useAuth();
    const fetchCYPSets =async():Promise<ICYPSet[]>=>{
        try {
            if(!user) return [];
            const isAdmin = isSystemAdmin.reader(user) || isSuperUser(user);
            const orgReader = eventOrganizerRoles.reader(user);;
            const cyps:ICYPSet[] = isAdmin ? await getCYPSets(): (orgReader && !isAdmin) ? await getPublicCYPSets() : await getCYPSetsForChurch(user?.churchId);
            const sorted = cyps.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    const {data:cypsets=[], isPending:loading, refetch} = useQuery({
        queryKey:['cyprforchurch'],
        queryFn:fetchCYPSets,
        enabled:!!user
    })

    return {cypsets, loading, refetch}
}


export const useFetchCYPSetForEvent = (eventId:string)=>{

    const fetchCYPSets = async():Promise<ICYPSet[]>=>{
        try {
            if(!eventId) return [];
            const cyps:ICYPSet[] = await getCYPSetsForEvent(eventId);
            const sorted = cyps.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:cypsets=[], isPending:loading, refetch} = useQuery({
        queryKey:['cyprforevent', eventId],
        queryFn:fetchCYPSets,
        enabled:!!eventId
    })



    return {cypsets, loading, refetch}
}