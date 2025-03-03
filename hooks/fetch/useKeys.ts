'use client'
import { getKeys } from "@/lib/actions/key.action";
import { IKey } from "@/lib/database/models/key.model"
import { useQuery } from "@tanstack/react-query";

export const useFetchKeys = ()=>{
  
    const fetchKeys = async():Promise<IKey[]> =>{
        try {
            const res:IKey[] = await getKeys();
            // console.log(res);
            const sorted  = res?.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:keys=[], isPending:loading, refetch} = useQuery({
        queryKey:['keys'],
        queryFn:fetchKeys
    })

    return {keys, loading, refetch}
}