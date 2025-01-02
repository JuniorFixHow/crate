import { getContracts, getUnusedContracts } from "@/lib/actions/contract.action";
import { IContract } from "@/lib/database/models/contract.model"
import { useEffect, useState } from "react"

export const useFetchContracts = ()=>{
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [freeContracts, setFreeContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchContracts = async () => {
            setLoading(true); // Ensure loading starts at the beginning
            try {
                const [conts, freeconts] = await Promise.all([
                    (getContracts() as unknown) as IContract[],
                    (getUnusedContracts() as unknown) as IContract[]
                ]);
    
                const sortedContracts = (Array.isArray(conts) ? conts : []).sort((a, b) =>
                    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
                );
    
                const sortedFreeContracts = (Array.isArray(freeconts) ? freeconts : []).sort((a, b) =>
                    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
                );
    
                setContracts(sortedContracts);
                setFreeContracts(sortedFreeContracts);
                setError(null);
            } catch (error) {
                console.error("Error fetching contracts:", error);
                setError("Error occurred fetching contracts");
            } finally {
                setLoading(false); // Ensure loading stops
            }
        };
    
        fetchContracts();
    }, []);
    
    
    return {contracts, freeContracts, error, loading}
}