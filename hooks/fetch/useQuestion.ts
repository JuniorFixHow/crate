import { getQuestionsForSet } from "@/lib/actions/question.action";
import { IQuestion } from "@/lib/database/models/question.model";
import { useQuery } from "@tanstack/react-query";

export const useFetchQuestionForSet = (id:string)=>{
    
    const fetchResponses = async():Promise<IQuestion[]>=>{
        try {
            if(!id) return [];
            const res:IQuestion[] = await getQuestionsForSet(id);
            // const sorted = res.sort((a, b)=> new Date(a.createdAt!)<new Date(b.createdAt!) ? 1:-1);
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    const {data:questions=[], isPending, refetch} = useQuery({
        queryKey:['questionsforset', id],
        queryFn:fetchResponses,
        enabled:!!id
    })

    return {questions, isPending, refetch}
}