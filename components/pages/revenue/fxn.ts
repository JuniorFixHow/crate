import { IChurch } from "@/lib/database/models/church.model";
import { IEvent } from "@/lib/database/models/event.model";
import { IMember } from "@/lib/database/models/member.model";
import { IPayment } from "@/lib/database/models/payment.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IZone } from "@/lib/database/models/zone.model";

export const SearchRevenue = (revenues:IPayment[], search:string, eventId:string, zoneId:string, churchId:string, purpose:string):IPayment[]=>{
    const data = revenues
    .filter((item)=>{
        const payer = item?.payer as unknown as IRegistration;
        const member = payer?.memberId as unknown as IMember;
        const church = member?.church as unknown as IChurch;
        const zone = church?.zoneId as unknown as IZone;
        return zoneId === '' ? item : zone?._id === zoneId
    })
    .filter((item)=>{
        const payer = item?.payer as unknown as IRegistration;
        const member = payer?.memberId as unknown as IMember;
        const church = member?.church as unknown as IChurch;
        return churchId === '' ? item : church._id === churchId
    })
    .filter((item)=>{
        const payer = item?.payer as unknown as IRegistration;
        const event = payer?.eventId as unknown as IEvent;
        return eventId === '' ? item : event?._id === eventId
    })
    .filter((item)=>{
        const payer = item?.payer as unknown as IRegistration;
        const member = payer?.memberId as unknown as IMember;
        return search === '' ? item : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
    })
    .filter((item)=>{
        return purpose === 'All' ? item : item.purpose === purpose
    })
    return data;
}




export const monthFirstDate=(date:string|Date):string=>{
    const now = new Date(date) || date;
    return now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}


export const calcTotalRevenue = (revenue:IPayment[]):number=>{
    const amount = revenue.reduce((sum:number, payment:IPayment)=> sum+payment.amount, 0);
    return amount
}

export const getEventTotalRevenue = (revenue:IPayment[], eventId:string):number=>{
    const data = revenue.filter((item)=>{
        const payer = item.payer as IRegistration;
        const event = payer.eventId as IEvent;
        return event._id === eventId;
    })
    .reduce((sum:number, payment:IPayment)=> sum+payment.amount, 0);
    return data;
}