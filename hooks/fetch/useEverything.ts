import { getEverything } from "@/lib/actions/misc";
import { IChurch } from "@/lib/database/models/church.model";
import { IEvent } from "@/lib/database/models/event.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IVendor } from "@/lib/database/models/vendor.model";
import { IZone } from "@/lib/database/models/zone.model";
import { useEffect, useState } from "react"

export const useFetchEverything = ()=>{
    const [members, setMembers] = useState<IMember[]>([]);
    const [registrations, setRegistrations] = useState<IRegistration[]>([]);
    const [churches, setChurches] = useState<IChurch[]>([]);
    const [zones, setZones] = useState<IZone[]>([]);
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchEvents = async()=>{
            try {
                const res = await getEverything();
                setMembers(res?.members);
                setRegistrations(res?.registrations);
                setChurches(res?.churches);
                setZones(res?.zones);
                setVendors(res?.vendors);
                setEvents(res?.events);
                setError(null); 
            } catch (error) {
                console.log(error)
                setError('Error occured fetching data.')
            }finally{
                setLoading(false);
            }
        }

        fetchEvents();
    },[])
    return {members, registrations, churches, zones, vendors, events, error, loading}
}
