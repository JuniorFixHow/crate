import { getVendors } from "@/lib/actions/vendor.action";
import { IVendor } from "@/lib/database/models/vendor.model";
import { useEffect, useState } from "react";

export const useFetchVendors = () => {
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const fetchedVendors: IVendor[] = await getVendors();
                setVendors(fetchedVendors.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching vendors');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    return { vendors, loading, error };
};