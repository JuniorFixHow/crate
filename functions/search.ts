import { AttendanceProps, EventProps, GroupProps, MemberProps, SessionProps } from "@/types/Types"
import { BadgeProps } from "@mui/material"

export const searchMember = (text:string, members:MemberProps[]):MemberProps[]=>{
    const membs = members.filter((member)=>{
        return text === '' ? member : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return membs
}
export const searchEvent = (text:string, events:EventProps[]):EventProps[]=>{
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


export const searchBadge = (text:string, badges:BadgeProps[]):BadgeProps[]=>{
    const bdg = badges.filter((badge)=>{
        return text === '' ? badge : Object.values(badge)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return bdg
}

export const searchAttenance = (text:string, attendances:AttendanceProps[]):AttendanceProps[]=>{
    const atts = attendances.filter((attendance)=>{
        return text === '' ? attendance : Object.values(attendance)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return atts
}

export const searchSession = (time:string, sessions:SessionProps[]):SessionProps[]=>{
    const sess = sessions.filter((ses)=>{
      return time === 'All' ? ses : ses.time === time
    })
    return sess
    // DON'T FORGET TO ADD EVENT ID LATER. FILTER FOR THE EVENT FIRST
}