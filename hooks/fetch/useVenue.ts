import { getVenues } from "@/lib/actions/venue.action";
import { IVenue } from "@/lib/database/models/venue.model";
import { useEffect, useState } from "react";


export const useFetchVenues = () => {
    const [venues, setVenues] = useState<IVenue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const fetchedVenues: IVenue[] = await getVenues();
                setVenues(fetchedVenues.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching venues');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    return { venues, loading, error };
};



