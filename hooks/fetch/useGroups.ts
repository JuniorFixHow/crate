import {  getEventGroups, getOptionalEventGroups } from "@/lib/actions/group.action";
import { getRoomsAssignedToGroup } from "@/lib/actions/room.action";
import { IGroup } from "@/lib/database/models/group.model"
import { IRoom } from "@/lib/database/models/room.model";
import { useQuery } from "@tanstack/react-query";
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
       
    const fetchGroups = async():Promise<IGroup[]>=>{
        try {
            if(!id) return [];
            const groups:IGroup[] = await getEventGroups(id);
            const sorted =  groups.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:groups=[], isPending:loading, refetch} = useQuery({
        queryKey:['groupsforevent', id],
        queryFn:fetchGroups,
        enabled:!!id
    })

    return {groups, refetch, loading}
}


export const useFetchRoomsForGroup = (id:string)=>{

    const fetchGroupRooms = async():Promise<IRoom[]>=>{
        try {
            if(!id) return [];
            const rooms:IRoom[] = await getRoomsAssignedToGroup(id);
            return rooms;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:groupRooms=[], refetch, isPending:loading} = useQuery({
        queryKey:['roomsforgroup', id],
        queryFn:fetchGroupRooms,
        enabled:!!id
    })

    return {groupRooms, refetch, loading}
}