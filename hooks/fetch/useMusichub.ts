import { checkIfAdmin } from "@/components/Dummy/contants";
import { useAuth } from "../useAuth"
import { IMusichub } from "@/lib/database/models/musichub.model";
import { getEventMusicHubs, getMusicHub, getMusicHubEvents, getMusicHubs, getMusicHubsForChurch } from "@/lib/actions/musichub.action";
import { useQuery } from "@tanstack/react-query";
import { canPerformAction, eventRoles, musichubRoles } from "@/components/auth/permission/permission";
import { useSearchParams } from "next/navigation";
import { IEvent } from "@/lib/database/models/event.model";

export const useFetchMusichub=()=>{
    const {user} = useAuth();
    const isAdmin = checkIfAdmin(user);

    const fetchMusic = async():Promise<IMusichub[]>=>{
        try {
            if(!user) return [];
            const res:IMusichub[] = isAdmin ? await getMusicHubs() : await getMusicHubsForChurch(user?.churchId);
            const sorted = res.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:musics=[], isPending, refetch} = useQuery({
        queryKey:['musichubs'],
        queryFn:fetchMusic,
        enabled:!!user
    })

    return {musics, isPending, refetch}
}


export const useFetchSingleMusichub=()=>{
    const {user} = useAuth();

    const searchParams = useSearchParams();
    
    const musicId = searchParams.get('id');
    

    const isAdmin = canPerformAction(user!, 'reader', {musichubRoles});

    const fetchMusic = async():Promise<IMusichub|null>=>{
        try {
            if(!user || !musicId) return null;
            if(!isAdmin) return null;
            const res:IMusichub = await getMusicHub(musicId); 
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const {data:music=null, isPending:loading, refetch:reload} = useQuery({
        queryKey:['musichub', musicId],
        queryFn:fetchMusic,
        enabled:!!isAdmin && !!musicId
    })

    return {music, loading, reload}
}


export const useFetchMusicHubEvents = (musicId:string) =>{
    const {user} = useAuth();
    const reader = canPerformAction(user!, 'reader', {eventRoles});

    const fetchEvents = async():Promise<IEvent[]>=>{
        try {
            if(!reader) return [];
            const res:IEvent[] = await getMusicHubEvents(musicId);
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:events=[], isPending, refetch} = useQuery({
        queryKey:['eventsformusichub', musicId],
        queryFn:fetchEvents,
        enabled:reader && !!musicId
    })

    return {events, isPending, refetch}
}


export const useFetchEventMusicHubs = (eventId:string) =>{

    const fetchMusic = async():Promise<IMusichub[]>=>{
        try {
            const res:IMusichub[] = await getEventMusicHubs(eventId);
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:musichubs=[], isPending, refetch} = useQuery({
        queryKey:['musichubsforevent', eventId],
        queryFn:fetchMusic,
        enabled:!!eventId
    })

    return {musichubs, isPending, refetch}
}
