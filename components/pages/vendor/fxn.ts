import { IChurch } from "@/lib/database/models/church.model";
import { IVendor } from "@/lib/database/models/vendor.model";
import { IZone } from "@/lib/database/models/zone.model";

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

export const SearchVendorV2 =(vondors:IVendor[],  churchId:string):IVendor[]=>{
    const data = vondors
    .filter((item)=> {
        const church = item?.church as IChurch;
        return churchId === '' ? item : church._id === churchId
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

export const SearchChurchWithZone =(churches:IChurch[], text:string, zoneId:string):IChurch[]=>{
    const data = churches
    .filter((item)=>{
        const zone = item.zoneId as unknown as IZone
        return zoneId === '' ? item : zoneId === zone._id
    })
    .filter((church)=>{
        return text === '' ? church : Object.values(church)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}

export const SearchChurchWithZoneV2 =(churches:IChurch[], zoneId:string):IChurch[]=>{
    const data = churches
    .filter((item)=>{
        const zone = item.zoneId as unknown as IZone
        return zoneId === '' ? item : zoneId === zone._id
    })
    return data;
}