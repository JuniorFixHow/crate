import { getContracts, getUnusedContracts } from "@/lib/actions/contract.action";
import { IContract } from "@/lib/database/models/contract.model"
import { useEffect, useState } from "react"

export const useFetchContracts = ()=>{
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [freeContracts, setFreeContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        const fetchContracts = async()=>{
            try {
                const [conts, freeconts] = await Promise.all([
                    getContracts() as unknown as IContract[],
                    getUnusedContracts() as unknown as IContract[]
                ])
                setContracts(conts.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setFreeContracts(freeconts.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (error) {
                console.log(error);
                setError('Error occured fetching contracts');
            }finally{
                setLoading(false);
            }
        }

        fetchContracts();

    },[])
    
    return {contracts, freeContracts, error, loading}
}