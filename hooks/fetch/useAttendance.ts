import { getAttendances } from "@/lib/actions/attendance.action";
import { IAttendance } from "@/lib/database/models/attendance.model";
import { useEffect, useState } from "react";

export const useFetchAttendances = (id:string) => {
    const [attendances, setAttendances] = useState<IAttendance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!id) return;
        const fetchAttendances = async () => {
            try {
                const fetchedAttendances: IAttendance[] = await getAttendances(id);
                
                setAttendances(fetchedAttendances.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching attendance records');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchAttendances();
    }, [id]); // Empty dependency array means this runs once when the component mounts

    return { attendances, loading, error };
};