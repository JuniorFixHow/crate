'use client'
import { getContractServices, getServices } from "@/lib/actions/service.action";
import { IService } from "@/lib/database/models/service.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export const useFetchServices = () =>{
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);
    const searchParams = useSearchParams();

    useEffect(()=>{
        const contractId = searchParams.get('contractId');
        const fetchServices = async()=>{
            try {
                let res:IService[];
                if(contractId){
                    res = await getContractServices(contractId);
                }else{
                    res = await getServices();
                }
                setServices(res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
            } catch (error) {
                setError('Error occured fetching services');
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        fetchServices();

    },[])

    return {services, loading, error}
}