import {  ChurchProps, VendorProps } from "@/types/Types";

export const SearchVendor =(vondors:VendorProps[], text:string, church:string):VendorProps[]=>{
    const data = vondors.filter((vendor)=>{
        return text === '' ? vendor : Object.values(vendor)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    }).filter((item)=> church === 'All Zones' ? item : item.church === church)
    return data;
}

export const SearchChurchWithoutZone =(churches:ChurchProps[], text:string, ):ChurchProps[]=>{
    const data = churches.filter((church)=>{
        return text === '' ? church : Object.values(church)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}