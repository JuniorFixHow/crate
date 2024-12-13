import { getSections, getSectionsWithQuestions } from "@/lib/actions/section.action";
import { ISection } from "@/lib/database/models/section.model"
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
    const [sections, setSections] = useState<ISection[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(()=>{
        if(!id) return;
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
    },[id])

    return {sections, loading, error}
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