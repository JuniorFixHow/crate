import { getAvailableRooms, getMembersInRoom, getMergedRegistrationData,  getMergedRegistrationDataForChurch,  getPublicRooms,  getRooms, getRoomsForChurchV2, getRoomsInaVenue } from "@/lib/actions/room.action";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IRoom } from "@/lib/database/models/room.model";
import {  IMergedRegistrationData } from "@/types/Types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { eventOrganizerRoles, isSuperUser, isSystemAdmin } from "@/components/auth/permission/permission";


export const useFetchRooms = () => {
    const {user} = useAuth();

    
    const fetchRooms = async ():Promise<IRoom[]> => {
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            const orgReader = eventOrganizerRoles.reader(user);
            const fetchedRooms:IRoom[] = isAdmin ? await getRooms(): (orgReader && !isAdmin) ? await getPublicRooms() : await getRoomsForChurchV2(user?.churchId) ;
            const sorted = fetchedRooms.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (err) {
            console.log(err);
            return [];
        } 
    };

    const {data:rooms=[], isPending:loading, refetch} = useQuery({
        queryKey:['rooms'],
        queryFn: fetchRooms,
        enabled:!!user
    })

    return { rooms, loading, refetch };
};


export const useFetchAvailableRooms = (eventId: string) => {

    const fetchRooms = async ():Promise<IRoom[]> => {
        try {
            if(!eventId) return [];
            const fetchedRooms: IRoom[] = await getAvailableRooms(eventId);
            const sorted = fetchedRooms.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            return sorted;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const {data:rooms=[], isPending:loading, refetch} = useQuery({
        queryKey:['availablerooms', eventId],
        queryFn:fetchRooms,
        enabled:!!eventId
    })

    return { rooms, loading, refetch };
};




export const useFetchMembersInRoom = (roomId:string)=>{
    const [members, setMembers] = useState<IRegistration[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        if(!roomId) return;
        const fetchKeys = async() =>{
            try {
                const res:IRegistration[] = await getMembersInRoom(roomId);
                setMembers(res.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()));
                setError(null);
            } catch (error) {
                console.log(error);
                setError('Error occured trying to fetch members.')
            }finally{
                setLoading(false);
            }
        }

        fetchKeys()
    },[roomId])

    return {members, loading, error}
}


export const useFetchRoomsRegistrationWithKeys = () => {

    const {user} = useAuth();

    const fetchRooms = async ():Promise<IMergedRegistrationData[]> => {
        try {
            if(!user) return [];
            const isAdmin = isSuperUser(user) || isSystemAdmin.reader(user);
            const fetchedRooms: IMergedRegistrationData[] = isAdmin ? await getMergedRegistrationData() : await getMergedRegistrationDataForChurch(user?.churchId);
            const sorted = fetchedRooms.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const {data=[], isPending:loading, refetch} = useQuery({
        queryKey:['roomregistrationswithkey'],
        queryFn:fetchRooms,
        enabled: !!user
    })

    return { data, loading, refetch };
};


export const useFetchRoomsForVenue = (venueId:string) => {

    const fetchRooms = async ():Promise<IRoom[]> => {
        try {
            if(!venueId) return [];
            const fetchedRooms:IRoom[] = await getRoomsInaVenue(venueId);
            const res = fetchedRooms.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1)
           return res;
        } catch (err) {
            console.log(err);
            return [];
        } 
    };
    
    const {data:rooms=[], isPending:loading, refetch} = useQuery({
        queryKey:['roomsinavenue', venueId],
        queryFn:fetchRooms,
        enabled:!!venueId
    })

    return { rooms, loading, refetch };
};