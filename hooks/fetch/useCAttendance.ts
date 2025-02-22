import { getCAttendances } from "@/lib/actions/cattendance.action";
import { ICAttendance } from "@/lib/database/models/classattendance.model";
import { useQuery } from "@tanstack/react-query";


export const useFetchCAttendances = (sessionId:string) => {
    
    const fetchAttendance = async():Promise<ICAttendance[]>=>{
        try {
            if(!sessionId) return [];
            const response:ICAttendance[] = await getCAttendances(sessionId);
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:attendances=[], isPending, refetch} = useQuery({
        queryKey:['cattendances', sessionId],
        queryFn: fetchAttendance,
        enabled: !!sessionId
    })

    return { attendances, isPending, refetch };
};