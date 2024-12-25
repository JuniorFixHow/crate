'use client'
import { getCampuses, getChurchCampuses } from "@/lib/actions/campuse.action";
import { ICampuse } from "@/lib/database/models/campuse.model"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export const useFetchCampuses = () =>{
    const [campuses, setCampuses] = useState<ICampuse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);
    const searchParams = useSearchParams();

    useEffect(()=>{
        const fetchCampuses = async()=>{
            try {
                const churchId = searchParams.get('churchId');
                let res:ICampuse[];
                if(churchId){
                    res = await getChurchCampuses(churchId);
                }else{
                    res = await getCampuses();
                }
                setCampuses(res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
            } catch (error) {
                setError('Error occured fetching campuses');
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        fetchCampuses();

    },[searchParams])

    return {campuses, loading, error}
}