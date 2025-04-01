'use client'
import { IHubclass } from "@/lib/database/models/hubclass.model";
import { useAuth } from "../useAuth"
import { checkIfAdmin } from "@/components/Dummy/contants";
import { eventOrganizerRoles } from "@/components/auth/permission/permission";
import { getChurchHubclasses, getHubclasses, getPublicHubclasses } from "@/lib/actions/hubclass.action";
import { useQuery } from "@tanstack/react-query";

export const useFetchHubClasses = ()=>{
    const {user} = useAuth();

    const fetchClasses = async():Promise<IHubclass[]>=>{
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const orgReader = eventOrganizerRoles.reader(user);
            const hubs:IHubclass[] = isAdmin ? 
            await getHubclasses() :
            (orgReader && !isAdmin) ? await getPublicHubclasses() :
            await getChurchHubclasses(user?.churchId);
                                     
            return hubs;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:hubs=[], isPending:loading, refetch} = useQuery({
        queryKey:['hubclasses'],
        queryFn: fetchClasses,
        enabled: !!user
    });

    return {hubs, loading, refetch}
}