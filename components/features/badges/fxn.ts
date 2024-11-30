import { IRegistration } from "@/lib/database/models/registration.model"

export const checkBadgeIssued = (eventId:string, eventReg:IRegistration[])=>{
    const regs= eventReg.filter((item)=>{
        if(typeof item.eventId === 'object'){
            return item.eventId._id.toString() === eventId
        }
    }).length
    const badgeIssued = eventReg.filter((item)=>{
        if(typeof item.eventId === 'object'){
            return (item.eventId._id.toString() === eventId) && item.badgeIssued === 'Yes'
        }
    }).length
    return {regs, badgeIssued};
}