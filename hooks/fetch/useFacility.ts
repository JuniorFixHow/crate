import { getAvailableFacilities, getFacilities, getFacilitiesForaVenue } from "@/lib/actions/facility.action";
import { IFacility } from "@/lib/database/models/facility.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export const useFetchFacilities = () => {
    const [facilities, setFacilities] = useState<IFacility[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const searchParam = useSearchParams();

    useEffect(() => {
        const fetchFacilities = async () => {
            const venueId = searchParam.get('venueId');
            try {
                let fetchedFacilities: IFacility[];
                if(venueId){
                    fetchedFacilities = await getFacilitiesForaVenue(venueId)
                }else{

                    fetchedFacilities = await getFacilities();
                } 
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
    }, [searchParam]);

    return { facilities, loading, error };
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
    const [facilities, setFacilities] = useState<IFacility[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!venueId) return;
        const fetchFacilities = async () => {
            try {
                const fetchedFacilities: IFacility[] = await getFacilitiesForaVenue(venueId);
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



