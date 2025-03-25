import { getChurches, getChurchesInaZone } from "@/lib/actions/church.action";
import { IChurch } from "@/lib/database/models/church.model";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { isSuperUser, isSystemAdmin } from "@/components/auth/permission/permission";

export const useFetchChurches = () => {
    const [churches, setChurches] = useState<IChurch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    useEffect(() => {
        const fetchChurches = async () => {
            const id = searchParams.get('zoneId');
            try {
                let fetchedChurches: IChurch[];
                if(id){
                    fetchedChurches = await getChurchesInaZone(id);
                }else{
                   fetchedChurches =  await getChurches();
                }
                setChurches(fetchedChurches.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching churches');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchChurches();
    }, [searchParams]); // Empty dependency array means this runs once when the component mounts

    return { churches, loading, error };
};

export const useFetchChurchesV2 = ()=>{
    const {user} = useAuth();
    const searchParams = useSearchParams();
    const zoneId = searchParams.get('zoneId');
    
    const fetchChurches = async():Promise<IChurch[]>=>{
        if(!user) return [];

        const isAdmin = checkIfAdmin(user);
        const data:IChurch[] = zoneId ? 
        await getChurchesInaZone(zoneId)
        :
        await getChurches();

        const sorted = data
        .filter((item)=>{
            return isAdmin ? item : item.name !== 'CRATE Main'
        })
        .sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1)
        return sorted;
    }

    const {data:churches=[], isPending, refetch} = useQuery({
        queryKey:['churcheswithzone', zoneId],
        queryFn: fetchChurches,
        enabled:!!user
    })

    return {churches, isPending, refetch}
}


export const useFetchChurchesV4 = ()=>{
    const {user} = useAuth();
    
    const fetchChurches = async():Promise<IChurch[]>=>{
        if(!user) return [];

        const isAdmin = checkIfAdmin(user);
       if(!isAdmin) return [];
        const data:IChurch[] =await getChurches();

        const sorted = data
        .filter((item)=>{
            return item.name !== 'CRATE Main'
        })
        .sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1)
        return sorted;
    }

    const {data:churches=[], isPending, refetch} = useQuery({
        queryKey:['churcheswithzonev2',],
        queryFn: fetchChurches,
        enabled:!!user
    })

    return {churches, isPending, refetch}
}


export const useFetchChurchesV5 = ()=>{
    const {user} = useAuth();
    
    const fetchChurches = async():Promise<IChurch[]>=>{
        if(!user) return [];

        const isAdmin = isSuperUser(user) || isSystemAdmin.reader(user);
        const data:IChurch[] =await getChurches();

        const sorted = data
        .filter((item)=>{
            return isAdmin ? item : item?._id.toString() === user?.churchId
        })
        .sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1)
        return sorted;
    }

    const {data:churches=[], isPending, refetch} = useQuery({
        queryKey:['churcheswithzonev3',],
        queryFn: fetchChurches,
        enabled:!!user
    })

    return {churches, isPending, refetch}
}


export const useFetchChurchesV3 = ()=>{
    
    const fetchChurches = async():Promise<IChurch[]>=>{
        const data:IChurch[] = await getChurches();

        return data;
    }

    const {data:churches=[], isPending, refetch} = useQuery({
        queryKey:['churches'],
        queryFn: fetchChurches
    })

    return {churches, isPending, refetch}
}