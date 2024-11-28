import { getZones } from "@/lib/actions/zone.action";
import { IZone } from "@/lib/database/models/zone.model";
import { useEffect, useState } from "react";

export const useFetchZones = () => {
    const [zones, setZones] = useState<IZone[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const fetchedZones: IZone[] = await getZones();
                setZones(fetchedZones.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching zones');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchZones();
    }, []); // Empty dependency array means this runs once when the component mounts

    return { zones, loading, error };
};