import { getTravelForEvent, getTravelHub, getTravelHubsForChurchInAnEvent } from "@/lib/actions/travel.action";
import { ITravelhub } from "@/lib/database/models/travelhub.model"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { canPerformEvent, eventOrganizerRoles } from "@/components/auth/permission/permission";

export const useFetchTravelhubs = (eventId:string)=>{

    const {user} = useAuth();
    const isAdmin = checkIfAdmin(user);
    const orgReader = canPerformEvent(user!, 'reader', {eventOrganizerRoles});

    const fetchTravellers = async():Promise<ITravelhub[]>=>{
        try {
            if(!eventId || !user) return [];
            const res:ITravelhub[] = (isAdmin || orgReader) ? await getTravelForEvent(eventId) : await getTravelHubsForChurchInAnEvent(user?.churchId, eventId);
            const sorted = res.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:travellers=[], isPending, refetch} = useQuery({
        queryKey:['travellersforevent', eventId],
        queryFn:fetchTravellers,
        enabled:!!eventId && !!user
    })

    return {travellers, isPending, refetch}
}


export const useFetchSingleTraveller = ()=>{
    const searchParam = useSearchParams();
    const id = searchParam.get('id');

    const fetchTraveller = async():Promise<ITravelhub|null>=>{
        try {
            if(!id) return null;
            const res:ITravelhub = await getTravelHub(id);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const {data:traveller, isPending, refetch} = useQuery({
        queryKey:['traveller', id],
        queryFn:fetchTraveller,
        enabled:!!id
    })

    return {traveller, isPending, refetch}
}