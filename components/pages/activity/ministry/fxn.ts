// import { IClassMinistryExtended } from "@/lib/database/models/classministry.model";
import { IClassMinistryExtended } from "@/types/Types";

export const SearchClassministry = (ministries:IClassMinistryExtended[], search:string, churchId:string):IClassMinistryExtended[]=>{
    const data = ministries
    ?.filter((item)=>{
        return churchId === '' ? item : item.churchId === churchId
    })
    ?.filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });

    return data;
}