'use client'
import { getCYPSets } from "@/lib/actions/cypset.action";
import { ICYPSet } from "@/lib/database/models/cypset.model"
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