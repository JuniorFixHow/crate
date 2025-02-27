import { checkIfAdmin } from "@/components/Dummy/contants"
import { ICard } from "@/lib/database/models/card.model"
import { useAuth } from "../useAuth"
import { getCards, getCardsForChurch } from "@/lib/actions/card.action";
import { useQuery } from "@tanstack/react-query";

export const useFetchCards = ()=>{
    const {user} = useAuth();

    const fetchCards = async():Promise<ICard[]> =>{
        try {
            const isAdmin = checkIfAdmin(user);
            if(!user) return [];
            const response:ICard[] = isAdmin ? 
            await getCards() : await getCardsForChurch(user?.churchId);
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:cards, isPending:loading, refetch} = useQuery({
        queryKey:['cards', user],
        queryFn:fetchCards,
        enabled:!!user
    })

    return {cards, loading, refetch}
}