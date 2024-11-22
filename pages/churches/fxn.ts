import { ChurchProps } from "@/types/Types";

export const SearchChurch =(churches:ChurchProps[], text:string, zone:string):ChurchProps[]=>{
    const data = churches.filter((church)=>{
        return text === '' ? church : Object.values(church)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    }).filter((item)=> zone === 'All Zones' ? item : item.zone === zone)
    return data;
}