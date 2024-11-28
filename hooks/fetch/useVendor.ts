import { getVendors } from "@/lib/actions/vendor.action";
import { IVendor } from "@/lib/database/models/vendor.model";
import { useEffect, useState } from "react";

export const useFetchVendors = () => {
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChurches = async () => {
            try {
                const fetchedChurches: IVendor[] = await getVendors();
                setVendors(fetchedChurches.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching vendors');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchChurches();
    }, []); // Empty dependency array means this runs once when the component mounts

    return { vendors, loading, error };
};