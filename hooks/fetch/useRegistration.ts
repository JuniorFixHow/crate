import { getCheckedInReg, getEligibleRegistrationsWithoutGroups, getReadyRegsWithEventId, getRegistrationsWithoutGroups, getRegs, getRegsWithEventId, getRegsWithEventIdAndChurchId } from "@/lib/actions/registration.action";
import { IRegistration } from "@/lib/database/models/registration.model"
import { useEffect, useState } from "react"
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";

export const useFetchRegistrations = ()=>{
    // const [registrations, setRegistrations] = useState<IRegistration[]>([]);
    // const [error, setError] = useState<string|null>(null);
    // const [loading, setLoading] = useState<boolean>(true);

    const fetchRegistrations = async():Promise<IRegistration[]>=>{
        try {
            const evts:IRegistration[] = await getRegs();
            return evts;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:registrations=[], isPending:loading, refetch} = useQuery({
        queryKey:['registrations'],
        queryFn:fetchRegistrations
    })

    return {registrations, refetch, loading}
}


export const useFetchRegistrationsWithEvents = (id:string, churchId:string)=>{
    const [eventRegistrations, setEventRegistrations] = useState<IRegistration[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if(!id || !churchId) return;
        const fetchRegistrations = async()=>{
            const controller = new AbortController()
            try {
                const evts:IRegistration[] = await getRegistrationsWithoutGroups(id, churchId);
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
    },[churchId, id])
    return {eventRegistrations, error, loading}
}

export const useFetchRegistrationsWithoutChurch = (id:string)=>{

    const fetchRegistrations = async():Promise<IRegistration[]>=>{
        try {
            if(!id) return [];
            const evts:IRegistration[] = await getEligibleRegistrationsWithoutGroups(id);
            const sorted = evts.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:eventRegistrations=[], isPending:loading, refetch} = useQuery({
        queryKey:['registrationswithoutgroups', id],
        queryFn:fetchRegistrations,
        enabled:!!id
    })

    return {eventRegistrations, refetch, loading}
}


export const useFetchRegistrationsAllGroups = (id:string)=>{
    
    const {user} = useAuth();

 
    const fetchRegistrations = async():Promise<IRegistration[]>=>{
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const regs:IRegistration[] = isAdmin ? await getRegsWithEventId(id)
            : await getRegsWithEventIdAndChurchId(id, user?.churchId);
            
            return regs;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:eventRegistrations=[], isPending:loading, refetch} = useQuery({
        queryKey:['registrations', id],
        queryFn:fetchRegistrations,
        enabled:!!user && !!id
    })

    return {eventRegistrations, refetch, loading}
}


export const useFetchReadyRegistrations = (eventId:string)=>{
    const [readyRegistrations, setReadyRegistrations] = useState<IRegistration[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if(!eventId) return;
        const fetchReadyReg = async()=>{
            try {
                const res = await getReadyRegsWithEventId(eventId);
                setReadyRegistrations(res);
            } catch (error) {
                console.log(error);
                setError('Error occured fetching registration data')
            }finally{
                setLoading(false);
            }
        }

        fetchReadyReg();
    },[eventId])

    return {loading, readyRegistrations, error}
}


export const useFetchCheckedInRegistrations = (eventId:string)=>{
    const [checkRegistrations, setCheckRegistrations] = useState<IRegistration[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if(!eventId) return;
        const fetchReadyReg = async()=>{
            try {
                const res = await getCheckedInReg(eventId);
                setCheckRegistrations(res);
            } catch (error) {
                console.log(error);
                setError('Error occured fetching registration data')
            }finally{
                setLoading(false);
            }
        }

        fetchReadyReg();
    },[eventId])

    return {loading, checkRegistrations, error}
}