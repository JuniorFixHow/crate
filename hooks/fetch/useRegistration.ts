import { getCheckedInReg, getEligibleRegistrationsWithoutGroups, getReadyRegsWithEventId, getRegistrationsWithoutGroups, getRegs, getRegsWithEventId, getRegsWithEventIdAndChurchId } from "@/lib/actions/registration.action";
import { IRegistration } from "@/lib/database/models/registration.model"
// import { useEffect, useState } from "react"
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";
// import { isSuperUser, isSystemAdmin } from "@/components/auth/permission/permission";

export const useFetchRegistrations = ()=>{

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
    // const {user} = useAuth();
    const fetchRegistrations = async():Promise<IRegistration[]>=>{
        try {
            if(!id || !churchId) return [];
            // const isAdmin = isSuperUser(user) || isSystemAdmin.reader(user);
            // const cId = isAdmin ? churchId : user?.churchId;
            const evts:IRegistration[] = await getRegistrationsWithoutGroups(id, churchId);
            return evts;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:eventRegistrations, isPending:loading, refetch} = useQuery({
        queryKey:['registrationsforevents', id, churchId],
        queryFn:fetchRegistrations,
        enabled:!!id && !!churchId
    }) 

    return {eventRegistrations, refetch, loading}
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

    const fetchReadyReg = async():Promise<IRegistration[]>=>{
        try {
            if(!eventId) return [];
            const res:IRegistration[] = await getReadyRegsWithEventId(eventId);
            const sorted  = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:readyRegistrations=[], isPending:loading, refetch} = useQuery({
        queryKey:['checkedinregistrations', eventId],
        queryFn:fetchReadyReg,
        enabled:!!eventId
    })

    return {loading, readyRegistrations, refetch}
}


export const useFetchCheckedInRegistrations = (eventId:string)=>{
   
    const fetchReadyReg = async():Promise<IRegistration[]>=>{
        try {
            if(!eventId) return [];
            const res:IRegistration[] = await getCheckedInReg(eventId);
            const sorted  = res.sort((a, b)=> new Date(a.checkedIn.date!)<new Date(b.checkedIn.date!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:checkRegistrations=[], isPending:loading, refetch} = useQuery({
        queryKey:['checkedinregistrations', eventId],
        queryFn:fetchReadyReg,
        enabled:!!eventId
    })

    return {loading, checkRegistrations, refetch}
}