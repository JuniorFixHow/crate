import { getRegistrationsWithoutGroups, getRegs, getRegsWithEventId } from "@/lib/actions/registration.action";
import { IRegistration } from "@/lib/database/models/registration.model"
import { useEffect, useState } from "react"

export const useFetchRegistrations = ()=>{
    const [registrations, setRegistrations] = useState<IRegistration[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchRegistrations = async()=>{
            const controller = new AbortController()
            try {
                const evts:IRegistration[] = await getRegs();
                setRegistrations(evts);
                setError(null); 
            } catch (error) {
                console.log(error);
                setError('Error occured fetching registrations.')
            }finally{
                setLoading(false);
            }
            return ()=> controller.abort()
        }

        fetchRegistrations();
    },[])
    return {registrations, error, loading}
}


export const useFetchRegistrationsWithEvents = (id:string)=>{
    const [eventRegistrations, setEventRegistrations] = useState<IRegistration[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if(!id) return;
        const fetchRegistrations = async()=>{
            const controller = new AbortController()
            try {
                const evts:IRegistration[] = await getRegistrationsWithoutGroups(id);
                setEventRegistrations(evts);
                setError(null); 
            } catch (error) {
                console.log(error);
                setError('Error occured fetching registrations.')
            }finally{
                setLoading(false);
            }
            return ()=> controller.abort()
        }

        fetchRegistrations();
    },[id])
    return {eventRegistrations, error, loading}
}


export const useFetchRegistrationsAllGroups = (id:string)=>{
    const [eventRegistrations, setEventRegistrations] = useState<IRegistration[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if(!id) return;
        const fetchRegistrations = async()=>{
            const controller = new AbortController()
            try {
                const evts:IRegistration[] = await getRegsWithEventId(id);
                setEventRegistrations(evts);
                setError(null); 
            } catch (error) {
                console.log(error);
                setError('Error occured fetching registrations.')
            }finally{
                setLoading(false);
            }
            return ()=> controller.abort()
        }

        fetchRegistrations();
    },[id])
    return {eventRegistrations, error, loading}
}
