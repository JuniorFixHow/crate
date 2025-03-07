import { IChurch } from "@/lib/database/models/church.model";
import { IZone } from "@/lib/database/models/zone.model";

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


export const SearchChurchV2 =(churches:IChurch[], zoneId:string):IChurch[]=>{
    const data = churches
    .filter((item)=> {
        const zone = item?.zoneId as IZone;
        return zoneId === '' ? item : zone._id === zoneId
    })
    return data;
}