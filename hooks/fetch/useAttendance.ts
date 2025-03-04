import { getAttendances } from "@/lib/actions/attendance.action";
import { IAttendance } from "@/lib/database/models/attendance.model";
import { useQuery } from "@tanstack/react-query";

export const useFetchAttendances = (id:string) => {
    
    const fetchAttendances = async ():Promise<IAttendance[]> => {
        try {
            if(!id) return [];
            const fetchedAttendances: IAttendance[] = await getAttendances(id);
            
            const sorted  = fetchedAttendances.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const {data:attendances=[], isPending:loading, refetch} = useQuery({
        queryKey:['attendances', id],
        queryFn: fetchAttendances,
        enabled: !!id
    })

    return { attendances, loading, refetch };
};