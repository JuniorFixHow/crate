'use client'
import { getCampuses, getChurchCampuses } from "@/lib/actions/campuse.action";
import { ICampuse } from "@/lib/database/models/campuse.model"
import { useSearchParams } from "next/navigation";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";

export const useFetchCampuses = () =>{
    const searchParams = useSearchParams();
    const {user} = useAuth();

    
    const fetchCampuses = async():Promise<ICampuse[]>=>{
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const churchId = searchParams.get('churchId');
            // add admin search here
            let res:ICampuse[];
            if(churchId){
                res = await getChurchCampuses(churchId);
            }else{
                res = isAdmin ? await getCampuses() : await getChurchCampuses(user?.churchId) ;
            }
            const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:campuses=[], isPending:loading, refetch} = useQuery({
        queryKey:['campuses', searchParams],
        queryFn:fetchCampuses,
        enabled:!!user
    })

    return {campuses, loading, refetch}
}