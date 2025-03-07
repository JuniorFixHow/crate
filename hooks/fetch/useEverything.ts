import { getEverything } from "@/lib/actions/misc";
import { IChurch } from "@/lib/database/models/church.model";
import { IEvent } from "@/lib/database/models/event.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IVendor } from "@/lib/database/models/vendor.model";
import { IZone } from "@/lib/database/models/zone.model";
import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react"


type EveryTypeProps = {
    members:IMember[];
    registrations:IRegistration[];
    churches:IChurch[];
    zones:IZone[];
    vendors:IVendor[];
    events:IEvent[]
}

export const useFetchEverything = ()=>{

    const Empty:EveryTypeProps = {
        members:[],
        registrations:[],
        churches:[],
        zones:[],
        vendors:[],
        events:[]
    }


    
    const fetchEverything = async():Promise<EveryTypeProps>=>{
        try {
            const res = await getEverything() as EveryTypeProps;
            return res;
        } catch (error) {
            console.log(error)
            return Empty;
        }
    }
    
    const {data=Empty, isPending:loading, refetch} = useQuery({
        queryKey:['everything'],
        queryFn:fetchEverything
    })

    const {members, registrations, churches, zones, vendors, events} = data;

    return {members, registrations, churches, zones, vendors, events, refetch, loading}
}
