import { ZoneProps } from "@/types/Types";

export const SearchZone =(zones:ZoneProps[], text:string):ZoneProps[]=>{
    const data = zones.filter((zone)=>{
        return text === '' ? zone : Object.values(zone)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}