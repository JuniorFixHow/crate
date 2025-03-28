import { getMembers, getMembersInaCampuse, getMembersInaChurch, getUnassignedMembers, getUserMembers } from "@/lib/actions/member.action";
import { IMember } from "@/lib/database/models/member.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useQuery } from "@tanstack/react-query";
import { eventOrganizerRoles } from "@/components/auth/permission/permission";

export const useFetchMembers = () => {

    const {user} = useAuth();
    const searchParams = useSearchParams();

    
    const fetchMembers = async ():Promise<IMember[]> => {
        try {
            let fetchedMembers: IMember[];
            if(!user) return [];
            const isAdmin = checkIfAdmin(user) || eventOrganizerRoles.reader(user);
            // console.log(isAdmin)
            const id = searchParams.get('registeredBy');
            const campuseId = searchParams.get('campuseId');
                if(id){
                    fetchedMembers = await getUserMembers(id);
                }
                else if(campuseId){
                    fetchedMembers = await getMembersInaCampuse(campuseId);
                }
                else{
                    fetchedMembers = isAdmin ? await getMembers() : await getMembersInaChurch(user?.churchId);
                }

                // console.log(fetchedMembers)
            const response = fetchedMembers.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1)
            return response;
        } catch (err) {
            console.log(err);
            return [];
        } 
    };
   
    const {data:members=[], isPending:loading, refetch} = useQuery({
        queryKey:['members', searchParams],
        queryFn:fetchMembers,
        enabled:!!user
    })

    return { members, loading, refetch };
};


export const useFetchFreeMembers = (eventId:string, churchId:string) => {
    
    const fetchMembers = async () => {
        try {
            if(!churchId || !eventId) return [];
            const fetchedMembers: IMember[] = await getUnassignedMembers(eventId, churchId);
            
            const sorted = fetchedMembers.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const {data:members=[], isPending:loading, refetch} = useQuery({
        queryKey:['freemembers', churchId, eventId],
        queryFn:fetchMembers,
        enabled: !!churchId && !!eventId
    })

    return { members, loading, refetch };
};


export const useFetchMembersInAChurch = ()=>{
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth();

    useEffect(()=>{
        const fetchChurchMembers = async()=>{
            setError(null);
            if(user){
                try {
                    const res:IMember[] = await getMembersInaChurch(user?.churchId);
                    setMembers(res);
                } catch (error) {
                    console.log(error);
                    setError('Error occured fetching members');
                }finally{
                    setLoading(false);
                }
            }
        }

        fetchChurchMembers();
    },[user])

    return {members, loading, error}
}


export const useFetchMembersInAChurchV2 = ()=>{
    const {user} = useAuth();

    const fetchMembersForChurch = async():Promise<IMember[]>=>{
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const response:IMember[] = isAdmin ?
            await getMembers() : await getMembersInaChurch(user?.churchId)

            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:members=[], isPending, refetch} =  useQuery({
        queryKey:['membersinachurch'],
        queryFn:fetchMembersForChurch,
        enabled: !!user
    })

    return {members, isPending, refetch}
}