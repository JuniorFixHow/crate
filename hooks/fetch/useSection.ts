import { getSections, getSectionsForSet, getSectionsWithQuestions } from "@/lib/actions/section.action";
import { ISection } from "@/lib/database/models/section.model"
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"

export const useFetchSections = ()=>{
    const [sections, setSections] = useState<ISection[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        const fetchSections = async()=>{
            try {
                const res = await getSections();
                setSections(res);
                setError(null);
            } catch (error) {
                console.log(error);
                setError('Error occured fetching sections');
            }finally{
                setLoading(false);
            }
        }

        fetchSections();
    },[])

    return {sections, loading, error}
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
    const [sections, setSections] = useState<ISection[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        const fetchSections = async()=>{
            try {
                const res = await getSectionsWithQuestions();
                setSections(res);
                setError(null);
            } catch (error) {
                console.log(error);
                setError('Error occured fetching sections');
            }finally{
                setLoading(false);
            }
        }

        fetchSections();
    },[])

    return {sections, loading, error}
}