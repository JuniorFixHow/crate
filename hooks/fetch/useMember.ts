import { getMembers, getMembersInaCampuse, getMembersInaChurch, getUnassignedMembers, getUserMembers } from "@/lib/actions/member.action";
import { IMember } from "@/lib/database/models/member.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";

export const useFetchMembers = () => {
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                let fetchedMembers: IMember[];
                const id = searchParams.get('registeredBy');
                const campuseId = searchParams.get('campuseId');
                    if(id){
                        fetchedMembers = await getUserMembers(id);
                    }
                    else if(campuseId){
                        fetchedMembers = await getMembersInaCampuse(campuseId);
                    }
                    else{
                        fetchedMembers = await getMembers();
                    }
                
                setMembers(fetchedMembers.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching members');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [ searchParams]); 

    return { members, loading, error };
};


export const useFetchFreeMembers = (eventId:string, churchId:string) => {
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if(!eventId || !churchId) return;
        const fetchMembers = async () => {
            try {
                const fetchedMembers: IMember[] = await getUnassignedMembers(eventId, churchId);
                
                setMembers(fetchedMembers.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching members');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [eventId, churchId]); 

    return { members, loading, error };
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