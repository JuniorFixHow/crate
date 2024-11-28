import { MemberProps } from "@/types/Types";

export const SearchMemberReversed = (members:MemberProps[], text:string):MemberProps[]=>{
    const data = members.filter((member)=>{
        return text === ''? null : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}