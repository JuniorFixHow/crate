import { getTimeOfDay } from "@/components/pages/session/fxn"
import { IAttendance } from "@/lib/database/models/attendance.model"
import { IEvent } from "@/lib/database/models/event.model"
import { IMember } from "@/lib/database/models/member.model"
import { IRegistration } from "@/lib/database/models/registration.model"
import { ISession } from "@/lib/database/models/session.model"
import { EventProps, GroupProps, MemberProps } from "@/types/Types"

export const searchMember = (text:string, members:IMember[]):IMember[]=>{
    const membs = members.filter((member)=>{
        return text === '' ? member : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return membs
}

export const searchMemberInversed = (text:string, members:IMember[]):IMember[]=>{
    const membs = members.filter((member)=>{
        return text === '' ? null : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return membs
}
export const searchEvent = (text:string, events:IEvent[]):IEvent[]=>{
    const evts = events.filter((event)=>{
        return text === '' ? event : Object.values(event)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return evts
}

export const searchItems = (
    text: string,
    groups?: GroupProps[],
    events?: EventProps[],
    members?: MemberProps[]
  ): (GroupProps | EventProps | MemberProps)[] => {
    let results: (GroupProps | EventProps | MemberProps)[] = [];
  
    if (groups) {
      results = results.concat(
        groups.filter((group) => {
          return text === '' 
            ? group 
            : Object.values(group)
                .join(' ')
                .toLowerCase()
                .includes(text.toLowerCase());
        })
      );
    }
  
    if (events) {
      results = results.concat(
        events.filter((event) => {
          return text === '' 
            ? event 
            : Object.values(event)
                .join(' ')
                .toLowerCase()
                .includes(text.toLowerCase());
        })
      );
    }
  
    if (members) {
      results = results.concat(
        members.filter((member) => {
          return text === '' 
            ? null 
            : Object.values(member)
                .join(' ')
                .toLowerCase()
                .includes(text.toLowerCase());
        })
      );
    }
  
    return results;
  };


export const searchBadge = (
  badges:IRegistration[],
  eventId:string,
  badge:string, date:string, room:string,  search:string
):IRegistration[]=>{
    const bdg = badges.filter((item)=>{
      if(typeof item.eventId === 'object'){
        return eventId === '' ? item : item.eventId._id === eventId
      }
    })
    .filter((item)=>{
      return badge === '' ? item : item.badgeIssued === badge
    })
    .filter((item)=>{
      return date === '' ? item : item.createdAt && new Date(item?.createdAt).toLocaleDateString() === new Date(date).toLocaleDateString()
    })
    .filter((item)=>{
      return room === '' ? item : item.status === room
    })
    .filter((item)=>{
      return search === '' ? item : Object.values(item)
      .join(' ').toLowerCase().includes(search.toLowerCase()) 
    })
    return bdg
}

export const searchAttenance = (text:string, attendances:IAttendance[]):IAttendance[]=>{
    const atts = attendances.filter((attendance)=>{
        if(typeof attendance?.member === 'object'){

          return text === '' ? attendance : Object.values(attendance.member)
          .join(' ')
          .toLowerCase()
          .includes(text.toLowerCase())
        }
    })
    return atts
}

export const searchSession = (time:string, eventId:string, sessions:ISession[]):ISession[]=>{
    const sess = sessions.filter((item)=>{
      if(typeof item.eventId === 'object'){
        return eventId === '' ? item : item.eventId._id === eventId
      }
    })
    .filter((ses)=>{
      return time === 'All' ? ses : getTimeOfDay(ses.from!) === time
    })
    return sess
    // DON'T FORGET TO ADD EVENT ID LATER. FILTER FOR THE EVENT FIRST
}