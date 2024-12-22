import { getActivityStatus, getTimeOfDay } from "@/components/pages/session/fxn"
import { IAttendance } from "@/lib/database/models/attendance.model"
import { IEvent } from "@/lib/database/models/event.model"
import { IMember } from "@/lib/database/models/member.model"
import { IRegistration } from "@/lib/database/models/registration.model"
import { ISession } from "@/lib/database/models/session.model"
import { IVendor } from "@/lib/database/models/vendor.model"
import { EventProps, GroupProps, MemberProps, NavigationProps } from "@/types/Types"

export const searchMember = (text:string, members:IMember[]):IMember[]=>{
    const membs = members.filter((member)=>{
        return text === '' ? member : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return membs
}

export const searchMemberForKey = (text:string, members:IRegistration[]):IRegistration[]=>{
    const membs = members.filter((member)=>{
        const data = member.memberId as unknown as IMember
        return text === '' ? member : Object.values(data)
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

export const searchRegistrationWithEvent = (text:string, events:IRegistration[]):IRegistration[]=>{
    const evts = events.filter((event)=>{
      const member = event.memberId as IMember;
        return text === '' ? event : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return evts
}

export const searchVednor = (text:string, vendors:IVendor[]):IVendor[]=>{
    const evts = vendors.filter((vendor)=>{
        return text === '' ? vendor : Object.values(vendor)
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
      if(room === ''){
        return item
      }else if(room === 'Assigned'){
        return item.roomIds && item.roomIds?.length > 0
      }else if(room === 'Unassigned'){
        return item?.roomIds === undefined || item.roomIds?.length === 0
      }
    })
    .filter((item)=>{
      return search === '' ? item : Object.values(item.memberId)
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

export const searchSession = (time: string, eventId: string, sessions: ISession[]): ISession[] => {
  const sess = sessions
      .filter((item) => {
          if (typeof item.eventId === 'object') {
              return eventId === '' ? item : item.eventId._id === eventId;
          }
          return false; // Ensure all paths return a boolean
      })
      .filter((ses) => {
          return time === 'All' ? ses : getTimeOfDay(ses.from!) === time;
      })
      .sort((a, b) => {
          // Sort by date ascending
          return new Date(a.from!) > new Date(b.from!) ? 1 : -1;
      })
      .sort((a, b) => {
          // Sort by activity status in the order of 'Ongoing', 'Upcoming', 'Completed'
          const order = { 'Ongoing': 0, 'Upcoming': 1, 'Completed': 2 };

          return order[getActivityStatus(a.from, a.to)] - order[getActivityStatus(b.from, b.to)];
      });

  return sess;
};



export const SearchNavbar = (items: NavigationProps[], search: string): NavigationProps[] => {
  if (!search.trim()) return []; // Return empty array for empty search

  return items.reduce<NavigationProps[]>((acc, item) => {
    // Check if the main item matches
    const isItemMatch = Object.values(item)
      .filter((value) => typeof value === 'string')
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());

    // Check if any children match
    const matchedChildren = item.children?.filter((child) =>
      Object.values(child)
        .filter((value) => typeof value === 'string')
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (isItemMatch || (matchedChildren && matchedChildren.length > 0)) {
      acc.push({
        ...item,
        children: matchedChildren || [],
      });
    }

    return acc;
  }, []);
};


