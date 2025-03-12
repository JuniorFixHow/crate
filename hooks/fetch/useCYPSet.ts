'use client'
import { getCYPSets, getCYPSetsForEvent } from "@/lib/actions/cypset.action";
import { ICYPSet } from "@/lib/database/models/cypset.model"
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"

export const useFetchCYPSet = ()=>{
    const [cypsets, setCypsets] = useState<ICYPSet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        const fetchCYPSets =async()=>{
            try {
                const cyps = await getCYPSets();
                setCypsets(cyps);
            } catch (error) {
                console.log(error);
                setError('Error occured fetching sets');
            }finally{
                setLoading(false);
            }
        }
        fetchCYPSets();
    },[])

    return {cypsets, loading, error}
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