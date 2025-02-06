// import { IClassministry } from "@/lib/database/models/classministry.model";
import { useAuth } from "../useAuth"
import { checkIfAdmin } from "@/components/Dummy/contants";
import { getChurchClassministries, getClassministries } from "@/lib/actions/classministry.action";
import { useQuery } from "@tanstack/react-query";
import { IClassMinistryExtended } from "@/types/Types";

export const useFetchClassministry = () =>{
    const {user} = useAuth();

    const fetchClassministry = async (): Promise<IClassMinistryExtended[]> => {
        try {
            if (!user) {
                return []; // Return an empty array if user is not defined
            }
    
            const isAdmin = checkIfAdmin(user);
            const response = isAdmin
                ? await getClassministries()
                : await getChurchClassministries(user.churchId);
    
            return response?.payload as IClassMinistryExtended[] || [];
        } catch (error) {
            console.error("Error fetching class ministries:", error);
            return []; // Return an empty array in case of error
        }
    };

    const {
        data:classMinistries, refetch, isPending
    } = useQuery({
        queryKey:['Classministry'],
        queryFn: fetchClassministry,
        enabled: !!user
    })

    return {classMinistries, refetch, isPending}
}