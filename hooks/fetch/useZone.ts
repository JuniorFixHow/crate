import { getZones } from "@/lib/actions/zone.action";
import { IZone } from "@/lib/database/models/zone.model";
import { useQuery } from "@tanstack/react-query";

export const useFetchZones = () => {
   
    const fetchZones = async ():Promise<IZone[]> => {
        try {
            const fetchedZones: IZone[] = await getZones();
            const sorted  = fetchedZones.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const {data:zones=[], isPending:loading, refetch} = useQuery({
        queryKey:['zones'],
        queryFn:fetchZones
    })

    return { zones, loading, refetch };
};