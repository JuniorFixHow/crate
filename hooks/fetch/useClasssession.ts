'use client'
import { getMinistryCSessions } from "@/lib/actions/classsession.action";
import { IClasssession } from "@/lib/database/models/classsession.model";
import {  useQuery } from "@tanstack/react-query";



export const useFetchClassSession =(classId:string)=>{

    const fetchSessions = async():Promise<IClasssession[]>=>{
        try {
            if(!classId){
                return []
            }
            const response = await getMinistryCSessions(classId) as IClasssession[]
            return response;
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const {data:sessions=[], isPending, refetch} = useQuery({
        queryKey:['classsessions', classId],
        queryFn:fetchSessions,
        enabled:!!classId
    })


    return {sessions, isPending, refetch}
}