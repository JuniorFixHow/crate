import { getChurches, getChurchesInaZone } from "@/lib/actions/church.action";
import { IChurch } from "@/lib/database/models/church.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useFetchChurches = () => {
    const [churches, setChurches] = useState<IChurch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    useEffect(() => {
        const fetchChurches = async () => {
            const id = searchParams.get('zoneId');
            try {
                let fetchedChurches: IChurch[];
                if(id){
                    fetchedChurches = await getChurchesInaZone(id);
                }else{
                   fetchedChurches =  await getChurches();
                }
                setChurches(fetchedChurches.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching churches');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchChurches();
    }, [searchParams]); // Empty dependency array means this runs once when the component mounts

    return { churches, loading, error };
};