import { getPayments, getUserPayments } from "@/lib/actions/payment.action";
import { IPayment } from "@/lib/database/models/payment.model"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export const useFetchRevenues = ()=>{
    const [revenues, setRevenues] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);
    
    const searchParams = useSearchParams();

    useEffect(()=>{
        const fetchRevenues = async()=>{
            try {
                const userId = searchParams.get('userId');
                let results:IPayment[];
                if(userId){
                    results = await getUserPayments(userId);
                }else{
                    results = await getPayments();
                }
                setRevenues(results);
                setError(null);
            } catch (error) {
                console.log(error);
                setError('Error occured fetching payments');
            }finally{
                setLoading(false);
            }
        }
        fetchRevenues();
    },[searchParams])

    // console.log('revenues: ',revenues)
    return {revenues, loading, error}
}