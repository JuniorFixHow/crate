import { IGroup } from "@/lib/database/models/group.model";
import { IRegistration } from "@/lib/database/models/registration.model";

export const SearchEventRegWithStatus = (eventsRegs:IRegistration[], search:string, status:string):IRegistration[]=>{
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