import { IMember } from "@/lib/database/models/member.model";

export const SearchMemberWithEverything = (
    members:IMember[], gender:string,
    status:string, age:string, date:string,
    search:string
):IMember[]=>{
    const data = members.filter((member)=>{
        return gender === '' ? member : member.gender === gender
    })
    .filter((member)=>{
        return age === '' ? member : member.ageRange === age
    })
    .filter((member)=>{
        return status === '' ? member : member.status === status
    })
    .filter((member)=>{
        if(member.createdAt){
            return date === '' ? member : new Date(member.createdAt).toLocaleDateString() === new Date(date).toLocaleDateString()
        }
    })
    .filter((member)=>{
        return search === '' ? member : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });
    return data;
}