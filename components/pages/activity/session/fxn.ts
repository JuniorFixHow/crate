import { ICAttendance } from "@/lib/database/models/classattendance.model"
import { IMember } from "@/lib/database/models/member.model"

export const searchAttenanceV2 = (text:string, attendances:ICAttendance[]):ICAttendance[]=>{
    const atts = attendances
    ?.filter((attendance)=>{
        const member  = attendance?.member as IMember;
        return text === '' ? attendance : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return atts
}