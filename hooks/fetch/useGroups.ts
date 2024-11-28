import { getGroups } from "@/lib/actions/group.action";
import { IGroup } from "@/lib/database/models/group.model"
import { useEffect, useState } from "react"

export const useFetchGroups = ()=>{
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchGroups = async()=>{
            try {
                const evts:IGroup[] = await getGroups();
                setGroups(evts);
                setError(null); 
            } catch (error) {
                console.log(error);
                setError('Error occured fetching groups.')
            }finally{
                setLoading(false);
            }
        }

        fetchGroups();
    },[])
    return {groups, error, loading}
}