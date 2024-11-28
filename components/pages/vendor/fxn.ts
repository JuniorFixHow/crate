import { IChurch } from "@/lib/database/models/church.model";
import { IVendor } from "@/lib/database/models/vendor.model";

export const SearchVendor =(vondors:IVendor[], text:string, church:string):IVendor[]=>{
    const data = vondors.filter((vendor)=>{
        return text === '' ? vendor : Object.values(vendor)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    .filter((item)=> {
        if(typeof item.church === 'object'){
           return church === '' ? item : item.church._id === church
        }
    })
    return data;
}

export const SearchChurchWithoutZone =(churches:IChurch[], text:string, ):IChurch[]=>{
    const data = churches.filter((church)=>{
        return text === '' ? church : Object.values(church)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}