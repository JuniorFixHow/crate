import { getRespondentsForSet, getResponsesForMember, getResponsesForQuestion, getResponsesForSet } from "@/lib/actions/response.action";
import { IMember } from "@/lib/database/models/member.model";
import { IQuestion } from "@/lib/database/models/question.model";
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

export const useFetchResponseForSetV2 = (id: string) => {
    const fetchResponses = async (): Promise<IResponse[]> => {
      try {
        if (!id) return [];
        const res: IResponse[] = await getResponsesForSet(id);
  
        // Sort responses based on the question's updatedAt or createdAt timestamp
        return res.sort((a, b) => {
          const questionA = a.questionId as IQuestion;
          const questionB = b.questionId as IQuestion;
  
          const timestampA = new Date(questionA.updatedAt || questionA.createdAt || 0).getTime();
          const timestampB = new Date(questionB.updatedAt || questionB.createdAt || 0).getTime();
  
          return timestampA - timestampB; // Sort oldest first
        });
      } catch (error) {
        console.log(error);
        return [];
      }
    };
  
    const { data: responses = [], isPending: loading, refetch } = useQuery({
      queryKey: ['responsesforsetv2', id],
      queryFn: fetchResponses,
      enabled: !!id,
    });
  
    return { responses, loading, refetch };
  };
  


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

