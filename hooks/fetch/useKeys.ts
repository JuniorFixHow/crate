'use client'
import { getKeys, getKeysForChurch } from "@/lib/actions/key.action";
import { IKey } from "@/lib/database/models/key.model"
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";

export const useFetchKeys = ()=>{
    const {user} = useAuth();
    const fetchKeys = async():Promise<IKey[]> =>{
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const res:IKey[] = isAdmin ? await getKeys() : await getKeysForChurch(user?.churchId);
            // console.log(res);
            const sorted  = res?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:keys=[], isPending:loading, refetch} = useQuery({
        queryKey:['keys'],
        queryFn:fetchKeys,
        enabled:!!user
    })

    return {keys, loading, refetch}
}