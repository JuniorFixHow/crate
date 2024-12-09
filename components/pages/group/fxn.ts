import { IGroup } from "@/lib/database/models/group.model";

export const SearchGroup=(groups:IGroup[], text:string, eventId:string):IGroup[]=>{
    const data = groups
    .filter((group)=>{
        if(typeof group.eventId === 'object'){
            return group.eventId._id === eventId
        }
    })
    .filter((item)=>{
        return text === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}
export const SearchGroupWithoutEvent=(groups:IGroup[], text:string ):IGroup[]=>{
    const data = groups
    .filter((item)=>{
        return text === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}