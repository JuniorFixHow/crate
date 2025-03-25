import { getSections, getSectionsForChurch, getSectionsForSet, getSectionsWithQuestions, getSectionsWithQuestionsForChurch } from "@/lib/actions/section.action";
import { ISection } from "@/lib/database/models/section.model"
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
// import { checkIfAdmin } from "@/components/Dummy/contants";
import { isSuperUser, isSystemAdmin } from "@/components/auth/permission/permission";

export const useFetchSections = ()=>{
   const {user} = useAuth();
    
    const fetchSections = async():Promise<ISection[]>=>{
        try {
            if(!user) return [];
            const isAdmin = isSuperUser(user) || isSystemAdmin.reader(user);
            const res:ISection[] = isAdmin ? await getSections() : await getSectionsForChurch(user?.churchId);
            const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:sections=[], isPending:loading, refetch} = useQuery({
        queryKey:['sectionsforset'],
        queryFn:fetchSections,
        enabled:!!user
    })

    return {sections, loading, refetch}
}

export const useFetchSectionsForSet = (id:string)=>{
    
    const fetchSections = async():Promise<ISection[]>=>{
        try {
            if(!id) return [];
            const res:ISection[] = await getSectionsForSet(id);
            const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    const {data:sections=[], isPending:loading, refetch} = useQuery({
        queryKey:['sectionsforset', id],
        queryFn:fetchSections,
        enabled:!!id
    })

    return {sections, loading, refetch}
}

export const useFetchSectionsWithQuestions = ()=>{
    const {user} = useAuth();

    const fetchSections = async():Promise<ISection[]>=>{
        try {
            if(!user) return [];
            const isAdmin = isSuperUser(user) || isSystemAdmin.reader(user);
            const res:ISection[] = isAdmin ? await getSectionsWithQuestions() : await getSectionsWithQuestionsForChurch(user?.churchId);
            const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:sections=[], isPending:loading, refetch} = useQuery({
        queryKey:['sectionswithquestion'],
        queryFn: fetchSections,
        enabled:!!user
    })

    return {sections, loading, refetch}
}