import { EventRegProps } from "@/types/Types";

export const SearchEventRegWithStatus = (eventsRegs:EventRegProps[], search:string, status:string):EventRegProps[]=>{
    const data = eventsRegs.filter((item)=>{
        return status === 'All' ? item : item.status === status
    }).filter((reg)=>{
        return search === '' ? reg : Object.values(reg)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });
    return data;
}