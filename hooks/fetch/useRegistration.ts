import { getRegs } from "@/lib/actions/registration.action";
import { IRegistration } from "@/lib/database/models/registration.model"
import { useEffect, useState } from "react"

export const useFetchRegistrations = ()=>{
    const [registrations, setRegistrations] = useState<IRegistration[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchRegistrations = async()=>{
            const controller = new AbortController()
            try {
                const evts:IRegistration[] = await getRegs();
                setRegistrations(evts);
                setError(null); 
            } catch (error) {
                console.log(error);
                setError('Error occured fetching registrations.')
            }finally{
                setLoading(false);
            }
            return ()=> controller.abort()
        }

        fetchRegistrations();
    },[])
    return {registrations, error, loading}
}