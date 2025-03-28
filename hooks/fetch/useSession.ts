import { getChurchSessions, getEventSessions, getPublicSessions, getSessions, getUserSessionsWithoutEvent } from "@/lib/actions/session.action";
import { ISession } from "@/lib/database/models/session.model"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { eventOrganizerRoles } from "@/components/auth/permission/permission";

export const useFetchSessions = ()=>{
    const searchParams = useSearchParams();
    const {user} = useAuth();

    const fetchSessions = async():Promise<ISession[]>=>{
        const id = searchParams.get('id');

        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const orgReader = eventOrganizerRoles.reader(user);
            let evts:ISession[];
            if(id){
               evts = await getUserSessionsWithoutEvent(id)
            }else{  
                evts = isAdmin ? await getSessions() : (!isAdmin && orgReader) ? await getPublicSessions() : await getChurchSessions(user?.churchId);
            }
            const sorted =  evts.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:sessions=[], isPending:loading, refetch} = useQuery({
        queryKey:['sessions', searchParams],
        queryFn:fetchSessions,
        enabled: !!user
    })

    return {sessions, refetch, loading}
}


export const useFetchSessionsWithEvent = (eventId:string)=>{
    const searchParams = useSearchParams();

    const fetchSessions = async():Promise<ISession[]>=>{
        const id = searchParams.get('id');
        try {
            let evts:ISession[];
            if(id){
               evts = await getUserSessionsWithoutEvent(id)
            }else{  
                evts = await getEventSessions(eventId);
            }
            const sorted =  evts.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error)
            return [];
        }
    }

    const {data:sessions=[], isPending:loading, refetch} = useQuery({
        queryKey:['sessionsforevent', searchParams, eventId],
        queryFn:fetchSessions,
        enabled: !!eventId
    })

    return {sessions, loading, refetch}
}