import { getSessions, getUserSessionsWithoutEvent } from "@/lib/actions/session.action";
import { ISession } from "@/lib/database/models/session.model"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export const useFetchSessions = ()=>{
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();

    useEffect(()=>{
        const fetchSessions = async()=>{
            const id = searchParams.get('id');
            try {
                let evts:ISession[];
                if(id){
                   evts = await getUserSessionsWithoutEvent(id)
                }else{  
                    evts = await getSessions();
                }
                setSessions(evts);
                setError(null); 
            } catch (error) {
                console.log(error)
                setError('Error occured fetching sessions.')
            }finally{
                setLoading(false);
            }
        }

        fetchSessions();
    },[searchParams])
    return {sessions, error, loading}
}