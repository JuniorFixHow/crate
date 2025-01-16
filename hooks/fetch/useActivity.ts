import { getActivities, getChurchMembersForActivities } from "@/lib/actions/activity.action";
import { IActivity } from "@/lib/database/models/activity.model";
import { IMember } from "@/lib/database/models/member.model";
import { useEffect, useState } from "react";

export const useFetchActivities = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const fetchedActivities: IActivity[] = await getActivities();
                setActivities(fetchedActivities.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching activities');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    return { activities, loading, error };
};


export const useFetchMembersForActivities = (id:string) => {
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!id) return;
        const fetchActivities = async () => {
            try {
                const fetchedActivities: IMember[] = await getChurchMembersForActivities(id);
                setMembers(fetchedActivities.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1));
                setError(null);
            } catch (err) {
                setError('Error fetching members');
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [id]);

    return { members, loading, error };
};