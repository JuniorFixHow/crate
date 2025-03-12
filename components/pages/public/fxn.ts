import { ICYPSet } from "@/lib/database/models/cypset.model";
import { IEvent } from "@/lib/database/models/event.model";

export const SearchCYPSet = (cyps:ICYPSet[], search:string, eventId:string):ICYPSet[]=>{
    const data = cyps
    .filter((cyp)=>{
        return eventId === '' ? cyp : cyp.eventId === eventId
    })
    .filter((cyp)=>{
        return search === '' ? cyp : Object.values(cyp)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}

export const SearchCYPSetV2 = (cyps:ICYPSet[], eventId:string):ICYPSet[]=>{
    const data = cyps
    .filter((cyp)=>{
        const event = cyp.eventId as IEvent;
        return eventId === '' ? cyp : event?._id === eventId
    })
    return data;
}