import { getCYPEvents, getEvents, getUnregisteredMembers, getUserEvents } from "@/lib/actions/event.action";
import { IEvent } from "@/lib/database/models/event.model"
import { IMember } from "@/lib/database/models/member.model";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export const useFetchEvents = ()=>{
    const [events, setEvents] = useState<IEvent[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();

    useEffect(()=>{
        const fetchEvents = async()=>{
            const id = searchParams.get('userId');
            try {
                let evts:IEvent[];
                if(id){
                    evts = await getUserEvents(id);
                }else{
                    evts = await getEvents();
                }
                setEvents(evts);
                setError(null); 
            } catch (error) {
                console.log(error)
                setError('Error occured fetching events.')
            }finally{
                setLoading(false);
            }
        }

        fetchEvents();
    },[searchParams])
    return {events, error, loading}
}


export const useFetchCYPEvents = ()=>{
    const [cypevents, setCYPEvents] = useState<IEvent[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchEvents = async()=>{
            try {
                const evts:IEvent[] = await getCYPEvents();
                setCYPEvents(evts);
                setError(null); 
            } catch (error) {
                console.log(error)
                setError('Error occured fetching events.')
            }finally{
                setLoading(false);
            }
        }

        fetchEvents();
    },[])
    return {cypevents, error, loading}
}


export const useFetchUnregisteredMembers = (eventId:string, memberIds:string[])=>{
    const fetchUnregistered = async():Promise<IMember[]>=>{
       try {
            const response = await getUnregisteredMembers(memberIds, eventId);
            const data = response?.payload as IMember[];
            return data;
       } catch (error) {
            console.log(error);
            return [];
       }
    }

    const {data:members, refetch, isPending, isError} = useQuery({
        queryKey:['unregistred', memberIds, eventId],
        queryFn:fetchUnregistered,
        enabled: !!eventId && !!memberIds.length
    })

    return {members, refetch, isPending, isError}
}