import { IZone } from "@/lib/database/models/zone.model";

export const SearchZone =(zones:IZone[], text:string):IZone[]=>{
    const data = zones.filter((zone)=>{
        return text === '' ? zone : Object.values(zone)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}