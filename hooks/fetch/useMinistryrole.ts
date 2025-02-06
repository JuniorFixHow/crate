import { getMinistryrolesforMinistry } from "@/lib/actions/ministryrole.action";
import { IMinistryrole } from "@/lib/database/models/ministryrole.model"
import { useQuery } from "@tanstack/react-query";

export const useFetchMinistryroleforMinistry = (ministryId:string)=>{
    const fetchMinistryroleforMinistry = async():Promise<IMinistryrole[]>=>{
        try {
            if(!ministryId) return [];
            const response:IMinistryrole[] = await getMinistryrolesforMinistry(ministryId);
            return response
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:ministryroles, refetch, isPending} = useQuery({
        queryKey:['ministryrole', ministryId],
        queryFn: fetchMinistryroleforMinistry,
        enabled: !!ministryId
    })

    return {ministryroles, refetch, isPending}
}