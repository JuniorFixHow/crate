import {  getEventGroups, getOptionalEventGroups } from "@/lib/actions/group.action";
import { IGroup } from "@/lib/database/models/group.model"
import { useEffect, useState } from "react"

export const useFetchGroups = (id?:string)=>{
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchGroups = async()=>{
            try {
                const evts:IGroup[] = await getOptionalEventGroups(id);
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
    },[id])
    return {groups, error, loading}
}

export const useFetchGroupsForEvent = (id:string)=>{
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if(!id) return;
        const fetchGroups = async()=>{
            try {
                const evts:IGroup[] = await getEventGroups(id);
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
    },[id])
    return {groups, error, loading}
}