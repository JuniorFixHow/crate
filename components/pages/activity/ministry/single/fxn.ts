import { IMember } from "@/lib/database/models/member.model"
import { IMinistryrole } from "@/lib/database/models/ministryrole.model"

export const SearchMinistryrole = (roles:IMinistryrole[], search:string):IMinistryrole[]=>{
    const data = roles?.filter((item)=>{
        const member = item?.memberId as unknown as IMember;
        return search === '' ? item : item.title.toLowerCase() === search.toLowerCase() ||
        Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })
    return data;
}