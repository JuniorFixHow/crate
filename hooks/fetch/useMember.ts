import { getMembers, getUserMembers } from "@/lib/actions/member.action";
import { IMember } from "@/lib/database/models/member.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useFetchMembers = () => {
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                let fetchedMembers: IMember[];
                const id = searchParams.get('registeredBy')
                    if(id){
                        fetchedMembers = await getUserMembers(id);
                    }else{
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
    }, [ searchParams]); // Empty dependency array means this runs once when the component mounts

    return { members, loading, error };
};