import { getVendorStats } from "@/lib/actions/misc";
import { getVendors, getVendorsInAChurch } from "@/lib/actions/vendor.action";
import { IVendor } from "@/lib/database/models/vendor.model";
import { useAuth } from "../useAuth";
import {  checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";

export const useFetchVendors = () => {
    const {user} = useAuth();
     
    const fetchVendor = async (): Promise<IVendor[]> => {
        try {
            if (!user) {
                return []; // Return an empty array if user is not defined
            }
    
            const isAdmin = checkIfAdmin(user);
    
            const users: IVendor[] =  isAdmin ? await getVendors() : await getVendorsInAChurch(user!.churchId)
            const sorted = users.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
    
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const {data:vendors=[], isPending:loading, refetch} = useQuery({
        queryKey:['allusers'],
        queryFn:fetchVendor,
        enabled:!!user
    })

    return { vendors, loading, refetch };
};


export const useFetchVendorStats = (id:string)=>{
    type StatsProps = {
        members:number,
        events:number,
        sessions:number,
        revenue:number,
    }

    const empty:StatsProps ={members:0, events:0, sessions:0, revenue:0} ;
    
    const fetchStats = async():Promise<StatsProps>=>{
        try {
            if(id) return empty;
            const res = await getVendorStats(id);
            const stats = {members:res?.members, events:res?.events, sessions:res?.sessions, revenue:res?.totalAmount};
            return stats;
        } catch (error) {
            console.log(error);
            return empty;
        }
    }

    const {data:stats=empty, isPending:statsLoading, refetch} = useQuery({
        queryKey:['userstats', id],
        queryFn:fetchStats,
        enabled:!!id
    })

    return {stats, refetch, statsLoading}
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


    const {data:users=[]} = useQuery({
        queryKey:['users'],
        queryFn:fetchVendor,
        enabled:!!user
    })

    return {users}
}