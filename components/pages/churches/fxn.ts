import { IChurch } from "@/lib/database/models/church.model";

export const SearchChurch =(churches:IChurch[], text:string, zone:string):IChurch[]=>{
    const data = churches.filter((church)=>{
        return text === '' ? church : Object.values(church)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    }).filter((item)=> {
        if(typeof item.zoneId === 'object'){
            return zone === '' ? item : item.zoneId._id === zone
        } 
    })
    return data;
}