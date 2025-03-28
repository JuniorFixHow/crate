import { getVenues, getVenuesForChurch } from "@/lib/actions/venue.action";
import { IVenue } from "@/lib/database/models/venue.model";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";
// import { canPerformEvent, eventOrganizerRoles } from "@/components/auth/permission/permission";


export const useFetchVenues = () => {

    const {user} = useAuth();

    const fetchVenues = async ():Promise<IVenue[]> => {
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const fetchedVenues: IVenue[] = isAdmin ? await getVenues() : await getVenuesForChurch(user?.churchId);
            const sorted = fetchedVenues.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    const {data:venues=[], isPending:loading, refetch} = useQuery({
        queryKey:['venues'],
        queryFn:fetchVenues,
        enabled:!!user
    })

    return { venues, loading, refetch };
};



