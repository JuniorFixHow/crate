import { getChurchPayments, getEventEstimatedRevenue, getPayments, getUserPayments } from "@/lib/actions/payment.action";
import { IPayment } from "@/lib/database/models/payment.model"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../useAuth";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { IExpectedRevenue } from "@/types/Types";

export const useFetchRevenues = ()=>{
    
    
    const searchParams = useSearchParams();
    const {user} = useAuth();
    

    const fetchRevenues = async():Promise<IPayment[]>=>{
        try {
            const userId = searchParams.get('userId');
            if(!user) return [];
            const isAdmin = checkIfAdmin(user);
            let results:IPayment[];
            if(userId){
                results = await getUserPayments(userId);
            }
            else if(!isAdmin){
                results = await getChurchPayments(user?.churchId);
            }
            else{
                results = await getPayments();
            }
            return results;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:revenues = [], isPending:loading, refetch} = useQuery({
        queryKey:['payments', searchParams],
        queryFn: fetchRevenues,
        enabled: !!user
    })

    // console.log('revenues: ',revenues)
    return {revenues, loading, refetch}
}


export const useFetchExpectedIncome = (eventId:string)=>{
    // const {user} = useAuth();

    const fetchIncome = async():Promise<IExpectedRevenue[]>=>{
        try {
            if(!eventId) return [];
            const response = await getEventEstimatedRevenue(eventId);
            return response?.payload as IExpectedRevenue[];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:income=[], isPending} =  useQuery({
        queryKey:['revenue', eventId],
        queryFn:fetchIncome,
        enabled:!!eventId
    })

    return {income, isPending}
}