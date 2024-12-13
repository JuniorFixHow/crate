import { getCYPEvents, getEvents, getUserEvents } from "@/lib/actions/event.action";
import { IEvent } from "@/lib/database/models/event.model"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export const useFetchEvents = ()=>{
    const [events, setEvents] = useState<IEvent[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();

    useEffect(()=>{
        const fetchEvents = async()=>{
            const id = searchParams.get('id');
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