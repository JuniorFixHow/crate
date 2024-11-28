import { MemberProps } from "@/types/Types";

export const getMembersNumberFromAge = (members:MemberProps[], filter:string):number=>{
    const number = members.filter((member)=>member.ageRange === filter).length;
    return number;
}