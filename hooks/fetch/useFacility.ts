import { getAvailableFacilities, getFacilities, getFacilitiesForaChurch, getFacilitiesForaVenue } from "@/lib/actions/facility.action";
import { IFacility } from "@/lib/database/models/facility.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";


export const useFetchFacilities = () => {
    
    const searchParam = useSearchParams();
    const {user} = useAuth();

    
    const fetchFacilities = async ():Promise<IFacility[]> => {
        const venueId = searchParam.get('venueId');
        const isAdmin = checkIfAdmin(user);
        try {
            if(!user) return [];
            let fetchedFacilities: IFacility[];
            if(venueId){
                fetchedFacilities = await getFacilitiesForaVenue(venueId)
            }
            else{

                fetchedFacilities = isAdmin ? await getFacilities() : await getFacilitiesForaChurch(user?.churchId);
            } 
            const sorted = fetchedFacilities.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (err) {
            console.log(err);
            return [];
        } 
    };

    const {data:facilities=[], isPending:loading, refetch} = useQuery({
        queryKey:['facilities', searchParam],
        queryFn: fetchFacilities,
        enabled:!!user
    })
    
    return { facilities, loading, refetch };
};


export const useFetchAvailableFacilities = (venueId:string) => {
    const [facilities, setFacilities] = useState<IFacility[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!venueId) return;
        const fetchFacilities = async () => {
            try {
                const fetchedFacilities: IFacility[] = await getAvailableFacilities(venueId);
                setFacilities(fetchedFacilities.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching facilities');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, [venueId]);

    return { facilities, loading, error };
};


export const useFetchVenueFacilities = (venueId:string) => {
    
    const fetchFacilities = async ():Promise<IFacility[]> => {
        try {
            if(!venueId) return [];
            const fetchedFacilities: IFacility[] = await getFacilitiesForaVenue(venueId);
            const sorted = fetchedFacilities.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const {data:facilities=[], isPending:loading, refetch} = useQuery({
        queryKey:['facilitiesforvenue', venueId],
        queryFn:fetchFacilities,
        enabled:!!venueId
    })

    return { facilities, loading, refetch };
};



