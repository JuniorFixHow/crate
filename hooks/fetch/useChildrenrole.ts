import { getChildrenrolesByClass } from "@/lib/actions/childrenrole.action";
import { IChildrenrole } from "@/lib/database/models/childrenrole.model"
import { useQuery } from "@tanstack/react-query";

export const useFetchChildrenrole = (classId:string) =>{

    const fetchRoles = async():Promise<IChildrenrole[]>=>{
        try {
            const res:IChildrenrole[] = await getChildrenrolesByClass(classId);
            const sorted = res.sort((a, b)=> new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:roles=[], isPending, refetch} = useQuery({
        queryKey:['childrenrolesbyclass', classId],
        queryFn:fetchRoles,
        enabled:!!classId
    });

    return {roles, isPending, refetch}
}