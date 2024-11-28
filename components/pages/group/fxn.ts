import { IGroup } from "@/lib/database/models/group.model";

export const SearchGroup=(groups:IGroup[], text:string, eventId:string):IGroup[]=>{
    const data = groups.filter((group)=>group.eventId === eventId)
        .filter((item)=>{
            return text === '' ? item : Object.values(item)
            .join(' ')
            .toLowerCase()
            .includes(text.toLowerCase())
        })
    return data;
}