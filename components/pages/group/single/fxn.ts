import { IMember } from "@/lib/database/models/member.model";
import { IRoom } from "@/lib/database/models/room.model";

export const SearchMemberReversed = (members:IMember[], text:string):IMember[]=>{
    const data = members.filter((member)=>{
        return text === ''? null : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return data;
}


export const SearchRoomsForSelections = (rooms:IRoom[], search:string):IRoom[]=>{
    const data = rooms.filter((room)=>{
        return search === '' ? room : Object.values(room)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });
    return data;
}