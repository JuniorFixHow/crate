import { ICYPSet } from "@/lib/database/models/cypset.model";

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