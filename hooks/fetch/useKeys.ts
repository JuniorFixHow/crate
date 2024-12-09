'use client'
import { getKeys } from "@/lib/actions/key.action";
import { IKey } from "@/lib/database/models/key.model"
import { useEffect, useState } from "react"

export const useFetchKeys = ()=>{
    const [keys, setKeys] = useState<IKey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        const fetchKeys = async() =>{
            try {
                const res:IKey[] = await getKeys();
                // console.log(res);
                setKeys(res?.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()));
                setError(null);
            } catch (error) {
                console.log(error);
                setError('Error occured trying to fetch keys.')
            }finally{
                setLoading(false);
            }
        }

        fetchKeys()
    },[])

    return {keys, loading, error}
}