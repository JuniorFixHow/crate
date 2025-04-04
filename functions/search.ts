import { getActivityStatus, getTimeOfDay } from "@/components/pages/session/fxn"
import { IAttendance } from "@/lib/database/models/attendance.model"
import { ICampuse } from "@/lib/database/models/campuse.model"
import { IChurch } from "@/lib/database/models/church.model"
import { IClasssession } from "@/lib/database/models/classsession.model"
import { IContract } from "@/lib/database/models/contract.model"
import { IEvent } from "@/lib/database/models/event.model"
import { IFacility } from "@/lib/database/models/facility.model"
import { IHubclass } from "@/lib/database/models/hubclass.model"
import { IMember } from "@/lib/database/models/member.model"
import { IMinistry } from "@/lib/database/models/ministry.model"
import { IRegistration } from "@/lib/database/models/registration.model"
import { ISession } from "@/lib/database/models/session.model"
import { IVendor } from "@/lib/database/models/vendor.model"
import { IVenue } from "@/lib/database/models/venue.model"
import { EventProps, GroupProps, MemberProps, NavigationProps } from "@/types/Types"

export const searchMember = (text:string, members:IMember[]):IMember[]=>{
    const membs = members?.filter((member)=>{
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

export const searchMemberInversedV2 = (text:string, churchId:string, members:IMember[]):IMember[]=>{
    const membs = members
    ?.filter((member)=>{
      const church = member.church as IChurch;
      return (churchId === '' || churchId === undefined) ? member : church._id === churchId
    })
    ?.filter((member)=>{
        if(text === '' && churchId){
          return member
        }else if(text === '' && !churchId){
          return null;
        }else{
          return Object.values(member)
          .join(' ')
          .toLowerCase()
          .includes(text.toLowerCase())
        }
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

export const searchVenues = (text:string, venues:IVenue[]):IVenue[]=>{
    const evts = venues.filter((venue)=>{
        return text === '' ? venue : Object.values(venue)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return evts
}


export const searchAvailableFacilities = (text:string, facilities:IFacility[]):IFacility[]=>{
    const evts = facilities.filter((facility)=>{
        return text === '' ? facility : Object.values(facility)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return evts
}

export const searchContract = (text:string, contracts:IContract[]):IContract[]=>{
    const evts = contracts.filter((contract)=>{
        return text === '' ? contract : Object.values(contract)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return evts
}

export const searchClass = (text:string, ministries:IMinistry[]):IMinistry[]=>{
  const data = ministries
  .filter((item)=>{
    return text === '' ? item : Object.values(item)
    .join(' ')
      .toLowerCase()
      .includes(text.toLowerCase())
  })

  return data;
}

export const searchCampus = (text:string, churchId:string, campuses:ICampuse[]):ICampuse[]=>{
    const evts = campuses
    .filter((item)=>{
      const church = item.churchId as IChurch;
      return churchId === '' ? item : church?._id === churchId
    })
    .filter((campus)=>{
        return text === '' ? campus : Object.values(campus)
        .join(' ')
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    return evts
}

export const searchCampusV2 = (churchId:string, campuses:ICampuse[]):ICampuse[]=>{
    const evts = campuses
    .filter((item)=>{
      const church = item.churchId as IChurch;
      return churchId === '' ? item : church?._id === churchId
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
):IRegistration[]=>{
    const bdg = badges.filter((item)=>{
      const event = item?.eventId as IEvent;
      return eventId === '' ? item : event?._id === eventId
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


export const searchSessionV2 = (time: string, activityId: string, sessions: IClasssession[]): IClasssession[] => {
  const sess = sessions
      ?.filter((item) => {
          const ministry = item?.classId as IMinistry;
          return activityId === '' ? item : ministry._id === activityId;
      })
      ?.filter((ses) => {
          return time === 'All' ? ses : getTimeOfDay(ses.from!) === time;
      })
      ?.sort((a, b) => {
          // Sort by date ascending
          return new Date(a.from!) > new Date(b.from!) ? 1 : -1;
      })
      ?.sort((a, b) => {
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

    // Recursively check for matches in children and grandchildren
    const matchChildren = (children: typeof item['children']): typeof item['children'] => {
      return children?.reduce<typeof item['children']>((childAcc, child) => {
        // Check if child matches
        const isChildMatch = Object.values(child)
          .filter((value) => typeof value === 'string')
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());

        // Check for matches in grandchildren
        const matchedGrandchildren = matchChildren(child.children || []);

        if (isChildMatch || matchedGrandchildren!.length > 0) {
          childAcc?.push({
            ...child,
            children: matchedGrandchildren,
          });
        }

        return childAcc;
      }, []) || [];
    };

    // Check for matches in children and grandchildren
    const matchedChildren = matchChildren(item.children);

    if (isItemMatch || (matchedChildren && matchedChildren.length > 0)) {
      acc.push({
        ...item,
        children: matchedChildren || [],
      });
    }

    return acc;
  }, []);
};



export const SearchHubClass = (hubs:IHubclass[], eventId:string):IHubclass[]=>{
  const data = hubs.filter((item)=> {
    const event = item?.eventId as IEvent;
    return (eventId === '' || eventId === undefined) ? item : event._id === eventId
  });
  return data;
}
