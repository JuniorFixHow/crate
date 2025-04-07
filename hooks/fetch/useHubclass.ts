'use client'
import { IHubclass } from "@/lib/database/models/hubclass.model";
import { useAuth } from "../useAuth"
import { checkIfAdmin } from "@/components/Dummy/contants";
import { eventOrganizerRoles } from "@/components/auth/permission/permission";
import { getChurchHubclasses, getHubclasses, getMembersForChildrenClass, getPublicHubclasses } from "@/lib/actions/hubclass.action";
import { useQuery } from "@tanstack/react-query";
// import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";

export const useFetchHubClasses = (eventId:string)=>{
    const {user} = useAuth();

    const fetchClasses = async():Promise<IHubclass[]>=>{
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const orgReader = eventOrganizerRoles.reader(user);
            const hubs:IHubclass[] = isAdmin ? 
            await getHubclasses(eventId) :
            (orgReader && !isAdmin) ? await getPublicHubclasses(eventId) :
            await getChurchHubclasses(user?.churchId, eventId);
            
            // console.log('Classes: ',hubs)

            return hubs;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:hubs=[], isPending:loading, refetch} = useQuery({
        queryKey:['hubclasses', eventId],
        queryFn: fetchClasses,
        enabled: !!user && !!eventId
    });

    return {hubs, loading, refetch}
}


export const useFetchMembersForHubClass = (eventId:string)=>{
    const fetchMembers = async():Promise<IRegistration[]>=>{
        try {
            if(!eventId) return [];
            const res:IRegistration[] = await getMembersForChildrenClass(eventId);
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:members=[], isPending:loading, refetch} = useQuery({
        queryKey:['membersforhubclass', eventId],
        queryFn:fetchMembers,
        enabled:!!eventId
    })

    return {members, loading, refetch}
}