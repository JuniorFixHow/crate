// import { IClassMinistryExtended } from "@/lib/database/models/classministry.model";
import { IClassMinistryExtended } from "@/types/Types";

export const SearchClassministry = (ministries:IClassMinistryExtended[], churchId:string):IClassMinistryExtended[]=>{
    const data = ministries
    ?.filter((item)=>{
        return (churchId === '' || churchId === undefined) ? item : item.churchId === churchId
    })
    return data;
}