import { getChurchEvents, getChurchEventsV2, getCYPEvents, getEvents, getPublicEvents, getUnregisteredMembers, getUserEvents } from "@/lib/actions/event.action";
import { IEvent } from "@/lib/database/models/event.model"
import { IMember } from "@/lib/database/models/member.model";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { eventOrganizerRoles } from "@/components/auth/permission/permission";

export const useFetchEvents = ()=>{
 
    const searchParams = useSearchParams();
    const {user} = useAuth();

    const fetchEvents = async():Promise<IEvent[]>=>{
        const id = searchParams.get('userId');
        try {
            let evts:IEvent[];
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const orgReader = eventOrganizerRoles.reader(user);
            if(id){
                evts = await getUserEvents(id);
            }
           
            else{
                evts = isAdmin ? await getEvents() : (orgReader && !isAdmin) ? await getPublicEvents() : await getChurchEventsV2(user?.churchId);
            }

            return evts;
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:events=[], isPending:loading, refetch} = useQuery({
        queryKey:['events', searchParams],
        queryFn:fetchEvents,
        enabled:!!user
    })
    return {events, refetch, loading}
}


export const useFetchEventsV2 = ()=>{
 
    const searchParams = useSearchParams();
    const {user} = useAuth();

    const fetchEvents = async():Promise<IEvent[]>=>{
        const id = searchParams.get('userId');
        try {
            let evts:IEvent[];
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const orgReader = eventOrganizerRoles.reader(user);
            if(id){
                evts = await getUserEvents(id);
            }
           
            else{
                evts = isAdmin ? await getEvents() : (orgReader && !isAdmin) ? await getPublicEvents() : await getChurchEvents(user?.churchId);
            }

            return evts;
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:events=[], isPending:loading, refetch} = useQuery({
        queryKey:['events', searchParams],
        queryFn:fetchEvents,
        enabled:!!user
    })
    return {events, refetch, loading}
}


export const useFetchEventsV5 = ()=>{
 
    const searchParams = useSearchParams();
    const {user} = useAuth();

    const fetchEvents = async():Promise<IEvent[]>=>{
        const id = searchParams.get('userId');
        try {
            let evts:IEvent[];
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const orgReader = eventOrganizerRoles.reader(user);
            if(id){
                evts = await getUserEvents(id);
            }
           
            else{
                evts = isAdmin ? await getEvents() : (orgReader && !isAdmin) ? await getPublicEvents() : await getChurchEvents(user?.churchId);
            }

            return evts;
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:events=[], isPending:loading, refetch} = useQuery({
        queryKey:['events', searchParams],
        queryFn:fetchEvents,
        enabled:!!user
    })
    return {events, refetch, loading}
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