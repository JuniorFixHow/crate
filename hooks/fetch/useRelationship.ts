import { IRelationship } from "@/lib/database/models/relationship.model"
import { useAuth } from "../useAuth"
import { checkIfAdmin } from "@/components/Dummy/contants";
import { getRelationships, getRelationshipsForChurch } from "@/lib/actions/relationship.action";
import { useQuery } from "@tanstack/react-query";

export const useFetchRelationship =()=>{
    const {user} = useAuth();

    const fetchRelationship = async():Promise<IRelationship[]> =>{
        try {
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);

            const response:IRelationship[] = isAdmin ?
            await getRelationships() :
            await getRelationshipsForChurch(user?.churchId);
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:relationships, refetch, isPending} = useQuery({
        queryKey:['relationships'],
        queryFn:fetchRelationship,
        enabled:!!user
    });

    return {relationships, refetch, isPending}
}