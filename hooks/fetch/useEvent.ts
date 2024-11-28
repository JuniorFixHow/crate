import { getEvents } from "@/lib/actions/event.action";
import { IEvent } from "@/lib/database/models/event.model"
import { useEffect, useState } from "react"

export const useFetchEvents = ()=>{
    const [events, setEvents] = useState<IEvent[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchEvents = async()=>{
            try {
                const evts:IEvent[] = await getEvents();
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
    },[])
    return {events, error, loading}
}