import { getAvailableRooms, getMembersInRoom, getRooms } from "@/lib/actions/room.action";
import { IMember } from "@/lib/database/models/member.model";
import { IRoom } from "@/lib/database/models/room.model";
import { ErrorProps } from "@/types/Types";
import { useEffect, useState } from "react";

export const useFetchRooms = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const fetchedRooms: IRoom[] = await getRooms();
                setRooms(fetchedRooms.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching rooms');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return { rooms, loading, error };
};


export const useFetchAvailableRooms = (eventId: string) => {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId) return;

        const fetchRooms = async () => {
            try {
                setLoading(true); // Set loading before API call
                const fetchedRooms: ErrorProps = await getAvailableRooms(eventId);

                if (fetchedRooms?.error) {
                    setError(fetchedRooms.message || 'Failed to fetch rooms');
                    return;
                }

                if (fetchedRooms?.payload) {
                    const items = fetchedRooms.payload as IRoom[]; // Type assertion
                    setRooms(items.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()));
                }

                setError(null); // Reset error on success
            } catch (err) {
                setError('Error fetching rooms');
                console.error(err);
            } finally {
                setLoading(false); // Ensure loading is false after API call
            }
        };

        fetchRooms();
    }, [eventId]);

    return { rooms, loading, error };
};




export const useFetchMembersInRoom = (roomId:string)=>{
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        if(!roomId) return;
        const fetchKeys = async() =>{
            try {
                const res:IMember[] = await getMembersInRoom(roomId);
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