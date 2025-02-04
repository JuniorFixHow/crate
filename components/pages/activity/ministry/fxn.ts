import { IClassministry } from "@/lib/database/models/classministry.model";

export const SearchClassministry = (ministries:IClassministry[], search:string, churchId:string):IClassministry[]=>{
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