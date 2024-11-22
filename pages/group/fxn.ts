import { GroupProps } from "@/types/Types"

export const SearchGroup=(groups:GroupProps[], text:string, eventId:string):GroupProps[]=>{
    const data = groups.filter((group)=>group.eventId === eventId)
                .filter((item)=>{
                    return text === '' ? item : Object.values(item)
                    .join(' ')
                    .toLowerCase()
                    .includes(text.toLowerCase())
                })
    return data;
}