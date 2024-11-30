import { IMember } from "@/lib/database/models/member.model";

export const SearchMemberReversed = (members:IMember[], text:string):IMember[]=>{
    const data = members.filter((member)=>{
        return text === ''? null : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}