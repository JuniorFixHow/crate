import { IChurch } from "@/lib/database/models/church.model";
import { IGroup } from "@/lib/database/models/group.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IZone } from "@/lib/database/models/zone.model";

export const SearchEventRegWithStatus = (eventsRegs:IRegistration[], search:string, status:string, churchId:string, zoneId:string):IRegistration[]=>{
    const data = eventsRegs
    .filter((item)=>{
        const member = item.memberId as unknown as IMember
        const church =  member.church as unknown as IChurch
        const zone =  church.zoneId as unknown as IZone
        return zoneId === '' ? item : zone._id === zoneId
    })
    .filter((item)=>{
        const member = item.memberId as unknown as IMember
        const church =  member.church as unknown as IChurch
        return churchId === '' ? item : church._id === churchId
    })
    .filter((item)=>{
        if(status === ''){
            return item
        }
        else if(status === 'Pending'){
            return (item?.roomIds?.length === 0) || (item?.roomIds === undefined)
        }
        else if(status === 'Assigned'){
            return item.roomIds && item.roomIds?.length > 0
        }
    }).filter((reg)=>{
        if(typeof reg.memberId === 'object'){
            return search === '' ? reg : Object.values(reg)
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
        }
    });
    return data;
}

export const SearchGroupWithStatus = (eventsRegs:IGroup[], search:string, status:string):IGroup[]=>{
    const data = eventsRegs.filter((item)=>{
        if(status === ''){
            return item
        }
        else if(status === 'Pending'){
            return (item?.roomIds?.length === 0) || (item?.roomIds === undefined)
        }
        else if(status === 'Assigned'){
            return item.roomIds && item.roomIds?.length > 0
        }
    }).filter((reg)=>{
        return search === '' ? reg : Object.values(reg)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });
    return data;
}