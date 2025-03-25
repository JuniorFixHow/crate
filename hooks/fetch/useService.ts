'use client'
import { getContractServices, getServices } from "@/lib/actions/service.action";
import { IService } from "@/lib/database/models/service.model";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react"

export const useFetchServices = () =>{
    const searchParams = useSearchParams();
    const contractId = searchParams.get('contractId');
    const {user} = useAuth();
    const isAdmin = checkIfAdmin(user);
    
    const fetchServices = async():Promise<IService[]>=>{
        try {
            if(!isAdmin) return [];
            let res:IService[];
            if(contractId){
                res = await getContractServices(contractId);
            }else{
                res = await getServices();
            }
            const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:services=[], isPending:loading, refetch} = useQuery({
        queryKey:['services', searchParams],
        queryFn: fetchServices,
        enabled:isAdmin
    })

    return {services, loading, refetch}
}