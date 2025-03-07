import { getZones } from "@/lib/actions/zone.action";
import { IZone } from "@/lib/database/models/zone.model";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";

export const useFetchZones = () => {
   const {user} = useAuth();
    const fetchZones = async ():Promise<IZone[]> => {
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const fetchedZones: IZone[] = await getZones();
            const sorted  = fetchedZones
            .filter((zone)=>{
                return isAdmin ? zone : zone.name !== 'CRATE Main'
            })
            .sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const {data:zones=[], isPending:loading, refetch} = useQuery({
        queryKey:['zones'],
        queryFn:fetchZones,
        enabled:!!user
    })

    return { zones, loading, refetch };
};