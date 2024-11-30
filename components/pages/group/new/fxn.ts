import { IRegistration } from "@/lib/database/models/registration.model"

export const SearchMemberForNewGroup=(registrations:IRegistration[], text:string):IRegistration[]=>{
    const data = registrations.filter((item)=>{
        if(typeof item?.memberId === 'object'){
            return text === '' ? item : Object.values(item.memberId)
            .join(' ')
            .toLowerCase()
            .includes(text.toLowerCase())
        }
    })
    return data;
}