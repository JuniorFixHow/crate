import { IEvent } from "@/lib/database/models/event.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";

export const checkCheckedIn = (eventId:string, eventReg:IRegistration[], events:IEvent[])=>{
    const eId = eventId || events[0]?._id;
    const regs = eventReg.filter((item)=>{
        const event = item?.eventId as unknown as IEvent;
        return event?._id === eId
    })
    .length;

    const checkValue = eventReg.filter((item)=>{
        const event = item.eventId as unknown as IEvent;
        return (event?._id === eId) && item?.checkedIn?.checked
    })
    .length;

    return {regs, checkValue}
}


export const SearchCheckedReg = (regs:IRegistration[], search:string, date:string):IRegistration[]=>{
    const data = regs
    .filter((item)=>{
        return date === '' ? item : new Date(item.checkedIn!.date).toLocaleDateString() === new Date(date).toLocaleDateString()
    })
    .filter((item)=>{
        const member = item.memberId as unknown as IMember;
        return search === '' ? item : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });

    return data;
}


export const SearchReadyReg = (regs:IRegistration[], search:string):IRegistration[]=>{
    const data = regs
    .filter((item)=>{
        const member = item.memberId as unknown as IMember;
        return search === '' ? null : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });

    return data;
}