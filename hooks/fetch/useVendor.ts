import { getVendorStats } from "@/lib/actions/misc";
import { getVendors, getVendorsInAChurch } from "@/lib/actions/vendor.action";
import { IVendor } from "@/lib/database/models/vendor.model";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import {  checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";

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


export const useFetchVendorStats = (id:string)=>{
    type StatsProps = {
        members:number,
        events:number,
        sessions:number,
        revenue:number,
    }
    const [stats, setStats] = useState<StatsProps>({members:0, events:0, sessions:0, revenue:0});
    const [statsLoading, setStatsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        if(!id) return;
        const fetchStats = async()=>{
            try {
                const res = await getVendorStats(id);
                setStats({members:res?.members, events:res?.events, sessions:res?.sessions, revenue:res?.totalAmount})
            } catch (error) {
                setError('Error occured while loading data.')
                console.log(error)
            }finally{
                setStatsLoading(false);
            }
        }
        fetchStats();
    },[id])


    return {stats, error, statsLoading}
}


export const useFetchVendorsQuery = ()=>{
    const {user} = useAuth();

    const fetchVendor = async (): Promise<IVendor[]> => {
        try {
            // if (!user) {
            //     return []; // Return an empty array if user is not defined
            // }
    
            const isAdmin = checkIfAdmin(user);
    
            let users: IVendor[];
            if (isAdmin) {
                users = await getVendors();
            } else {
                users = await getVendorsInAChurch(user!.churchId);
            }
    
            return users;
        } catch (error) {
            console.log(error);
            throw error; // Consider re-throwing the error or handling it as needed
        }
    };


    const {data:users} = useQuery({
        queryKey:['users'],
        queryFn:fetchVendor,
        enabled:!!user
    })

    return {users}
}