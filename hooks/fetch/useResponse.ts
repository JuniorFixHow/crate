import { getRespondentsForSet, getResponsesForMember, getResponsesForQuestion, getResponsesForSet } from "@/lib/actions/response.action";
import { IMember } from "@/lib/database/models/member.model";
import { IResponse } from "@/lib/database/models/response.model";
import { useQuery } from "@tanstack/react-query";



export const useFetchResponseForSet = (id:string)=>{
    
    const fetchResponses = async():Promise<IResponse[]>=>{
        try {
            if(!id) return [];
            const res:IResponse[] = await getResponsesForSet(id);
            const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return sorted;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    const {data:responses=[], isPending:loading, refetch} = useQuery({
        queryKey:['responsesforset', id],
        queryFn:fetchResponses,
        enabled:!!id
    })

    return {responses, loading, refetch}
}


export const useFetchResponseForQuestions = (id:string)=>{
    
    const fetchResponses = async():Promise<IResponse[]>=>{
        try {
            if(!id) return [];
            const res:IResponse[] = await getResponsesForQuestion(id);
            // const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    const {data:responses=[], isPending:loading, refetch} = useQuery({
        queryKey:['responsesforquestion', id],
        queryFn:fetchResponses,
        enabled:!!id
    })

    return {responses, loading, refetch}
}


export const useFetchResponseForMember = (id:string)=>{
    
    const fetchResponses = async():Promise<IResponse[]>=>{
        try {
            if(!id) return [];
            const res:IResponse[] = await getResponsesForMember(id);
            // const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    const {data:responses=[], isPending:loading, refetch} = useQuery({
        queryKey:['responsesformember', id],
        queryFn:fetchResponses,
        enabled:!!id
    })

    return {responses, loading, refetch}
}


export const useFetchSetRespondents = (id:string)=>{
    
    const fetchResponses = async():Promise<IMember[]>=>{
        try {
            if(!id) return [];
            const res:IMember[] = await getRespondentsForSet(id);
            // const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    const {data:members=[], isPending, refetch} = useQuery({
        queryKey:['respondentsforset', id],
        queryFn:fetchResponses,
        enabled:!!id
    })

    return {members, isPending, refetch}
}

