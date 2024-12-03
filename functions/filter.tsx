import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IVendor } from "@/lib/database/models/vendor.model";
import { IZone } from "@/lib/database/models/zone.model";
import { MaybePopulated, MemberProps } from "@/types/Types";
import mongoose from "mongoose";

export const getUniqueValues = (filter: string, members: IMember[]): string[] => {
    const uniqueValues = (array: (string | undefined)[]): string[] => 
        Array.from(new Set(array.filter(Boolean) as string[]));

    switch (filter) {
        case 'Age':
            return uniqueValues(members.map(member => member.ageRange)).sort((a, b) => a.localeCompare(b));
        case 'Country':
            return uniqueValues(
                members.map(member => 
                    typeof member.church === 'object' && 'zoneId' in member.church && 
                    typeof member.church.zoneId === 'object' && 'country' in member.church.zoneId 
                        ? member.church.zoneId.country 
                        : undefined
                )
            ).sort((a, b) => a.localeCompare(b));
        case 'Church':
            return uniqueValues(
                members.map(member => 
                    typeof member.church === 'object' && 'name' in member.church 
                        ? member.church.name 
                        : undefined
                )
            ).sort((a, b) => a.localeCompare(b));
        case 'Gender':
            return uniqueValues(members.map(member => member.gender)).sort((a, b) => a.localeCompare(b));
        case 'Registered By':
            return uniqueValues(
                members.map(member => 
                    typeof member.registeredBy === 'object' && 'name' in member.registeredBy
                        ? member.registeredBy.name 
                        : undefined
                )
            ).sort((a, b) => a.localeCompare(b));
        default:
            return [];
    }
};





export const countMembers = (
    filter: string,
    members: IMember[],
    churches: IChurch[],
    zones: IZone[]
  ): number[] => {
    const countMap: Record<string, number> = {};
  
    members.forEach((member) => {
      let value: string;
  
      switch (filter) {
        case 'Age':
          value = member.ageRange;
          break;
  
        case 'Church':
          const church = typeof member.church === 'string'
            ? churches.find((ch) => ch._id === member.church)
            : (member.church as IChurch);
          value = church?.name || 'Unknown Church';
          break;
  
        case 'Zone':
          const memberChurch = typeof member.church === 'string'
            ? churches.find((ch) => ch._id === member.church)
            : (member.church as IChurch);
          const zone = typeof memberChurch?.zoneId === 'string'
            ? zones.find((z) => z._id === memberChurch.zoneId)
            : (memberChurch?.zoneId as IZone);
          value = zone?.name || 'Unknown Zone';
          break;
  
        case 'Country':
          const churchForCountry = typeof member.church === 'string'
            ? churches.find((ch) => ch._id === member.church)
            : (member.church as IChurch);
          const zoneForCountry = typeof churchForCountry?.zoneId === 'string'
            ? zones.find((z) => z._id === churchForCountry.zoneId)
            : (churchForCountry?.zoneId as IZone);
          value = zoneForCountry?.country || 'Unknown Country';
          break;
  
        case 'Gender':
          value = member.gender;
          break;
  
        case 'Registered By':
          value =
            typeof member.registeredBy === 'string'
              ? member.registeredBy
              : (member.registeredBy as IVendor).name || 'Unknown';
          break;
  
        default:
          return;
      }
  
      countMap[value] = (countMap[value] || 0) + 1;
    });
  
    return Object.values(countMap);
  };
  





  export const countRegistrationsForEvent = (
    eventId: string,
    filter: string,
    registrations: IRegistration[],
    members: IMember[],
    churches: IChurch[],
    zones: IZone[]
): number[] => {
    const countMap: Record<string, number> = {};

    // Filter registrations by eventId
    const eventRegistrations = registrations.filter(registration => {
        if(eventId === ''){
            return registration
        }else{
            if(registration.eventId){
                return registration?.eventId.toString() === eventId
            }
        }
    });

    eventRegistrations.forEach((registration) => {
        const member = members.find(m => m._id.toString() === registration.memberId.toString());
        let value: string;

        switch (filter) {
            case 'Age':
                value = member?.ageRange || 'Unknown Age';
                break;

            case 'Church':
                // Check if church is an object, not a string
                const church = typeof member?.church === 'object' && member?.church !== null
                    ? member?.church
                    : (typeof member?.church === 'string' ? churches.find((ch) => ch._id.toString() === member?.church) : undefined);
                value = ('name' in church! && church.name) || 'Unknown Church';
                break;

            case 'Zone':
                // Check if church and zoneId are objects
                const churchForZone = typeof member?.church === 'object' && member?.church !== null
                    ? member?.church
                    : (typeof member?.church === 'string' ? churches.find((ch) => ch._id.toString() === member?.church) : undefined);
                const zone = typeof churchForZone === 'object' && 'zoneId' in churchForZone && churchForZone?.zoneId !== null
                    ? churchForZone?.zoneId
                    : ( typeof churchForZone === 'object' && 'zoneId' in churchForZone && typeof churchForZone.zoneId === 'string' ? zones.find((z) => z._id.toString() === churchForZone?.zoneId) : undefined);
                value = (typeof zone === 'object' && 'name' in zone && zone?.name) || 'Unknown Zone';
                break;

            case 'Country':
                // Check if the zone is an object before accessing country
                const churchForCountry = typeof member?.church === 'object' && member?.church !== null
                    ? member?.church
                    : (typeof member?.church === 'string' ? churches.find((ch) => ch._id.toString() === member?.church) : undefined);
                const zoneForCountry = typeof churchForCountry === 'object' && 'zoneId' in churchForCountry && typeof churchForCountry?.zoneId === 'object' && churchForCountry?.zoneId !== null
                    ? churchForCountry?.zoneId
                    : (typeof churchForCountry === 'object' && 'zoneId' in churchForCountry && typeof churchForCountry?.zoneId === 'string' ? zones.find((z) => z._id.toString() === churchForCountry?.zoneId) : undefined);
                value = (typeof zoneForCountry === 'object' && 'country' in zoneForCountry && zoneForCountry?.country) || 'Unknown Country';
                break;

            case 'Gender':
                value = member?.gender || 'Unknown Gender';
                break;

            

            case 'Registration Type':
                value = registration.groupId ? 'Group' : 'Individual';
                break;

            default:
                return;
        }

        // Increment the count for the given value
        countMap[value] = (countMap[value] || 0) + 1;
    });

    // Return the counts as an array of numbers
    return Object.values(countMap);
};




export function getGenderPercentageForEvent(
  eventId: string,
  registrations: MaybePopulated<IRegistration, 'memberId' | 'eventId'>[],
  members: MaybePopulated<IMember, 'church'>[],
  gender: 'Male' | 'Female'
) {
  // Filter registrations by eventId
  const filteredRegistrations = registrations.filter(
    reg => {
      if (typeof reg.eventId === 'object' && '_id' in reg.eventId) {
        return reg.eventId._id?.toString() === eventId;
      }
      return reg.eventId?.toString() === eventId;
    }
  );

  // Extract memberIds from filtered registrations
  const memberIds = filteredRegistrations
    .map(reg => {
      if (typeof reg.memberId === 'object' && '_id' in reg.memberId) {
        return reg.memberId._id.toString();
      }
      return reg.memberId?.toString();
    })
    .filter((id): id is string => !!id);

  // Filter members using the collected memberIds
  const filteredMembers = members.filter(member => memberIds.includes(member._id.toString()));

  // Calculate the number of members for the specified gender and total registrations
  const genderCount = filteredMembers.filter(member => member.gender === gender).length;
  const totalCount = filteredMembers.length;

  // Calculate percentage of specified gender
  const percentage = totalCount > 0 ? ((genderCount / totalCount) * 100).toFixed() : 0;
  const percent = `${genderCount} (${percentage}%)`

  return {percent, genderCount, totalCount};
}
 




export const getMales =(members:IMember[]):string =>{
    const males = members.filter((m)=>m.gender === 'Male').length;
    const percent = ((males/members.length)*100).toFixed();
    return `(${males}) ${percent}%`
}

export const getFemales =(members:IMember[]):string =>{
    const females = members.filter((m)=>m.gender === 'Female').length;
    const percent = ((females/members.length)*100).toFixed();
    return `(${females}) ${percent}%`
}

export const getMaleValue =(members:IMember[]):number =>{
    const males = members.filter((m)=>m.gender === 'Male').length;
    return males
}

export const getFemaleValue =(members:MemberProps[]):number =>{
    const females = members.filter((m)=>m.gender === 'Female').length;
    return females
}
export const getFamilyAndGroupValue =(members:MemberProps[]):number =>{
    const fandg = members.filter((m)=>m.registerType !== 'Individual').length;
    return fandg
}



export function getUniqueValuesForEvent(
    eventId: string,
    registrations: MaybePopulated<IRegistration, 'memberId' | 'eventId'>[],
    members: MaybePopulated<IMember, 'church'>[],
    caseType: 'Age Range' | 'Gender' | 'Church'
  ): string[] {
    // Filter registrations by eventId
    const filteredRegistrations = registrations.filter(
        reg => {
          if (typeof reg.eventId === 'object' && '_id' in reg.eventId) {
            return reg.eventId._id?.toString() === eventId;
          }
          return reg.eventId?.toString() === eventId;
        }
      );
      
  
    // Extract memberIds from filtered registrations
    const memberIds = filteredRegistrations
        .map(reg => {
            if (typeof reg.memberId === 'object' && '_id' in reg.memberId) {
            return reg.memberId._id.toString();
            }
            return reg.memberId?.toString(); // For string or ObjectId
        })
        .filter((id): id is string => !!id); // Ensure non-null strings

  
    // Filter members using the collected memberIds
    const filteredMembers = members.filter(member => memberIds.includes(member._id.toString()));
  
    // Use a set to store unique values based on caseType
    const uniqueValuesSet = new Set<string>();
  
    // Determine unique values based on caseType
    switch (caseType) {
      case 'Church':
        filteredMembers.forEach(member => {
            if (typeof member.church !== 'string' && !(member.church instanceof mongoose.Types.ObjectId)) {
            if (member.church.name) {
                uniqueValuesSet.add(member.church.name);
            }
            }
        });
        break;
  
      case 'Age Range':
        filteredMembers.forEach(member => {
          if (member.ageRange) {
            uniqueValuesSet.add(member.ageRange);
          }
        });
        break;
  
      case 'Gender':
        filteredMembers.forEach(member => {
          if (member.gender) {
            uniqueValuesSet.add(member.gender);
          }
        });
        break;
  
      default:
        throw new Error(`Invalid caseType: ${caseType}`);
    }
  
    // Convert set to array and return
    return Array.from(uniqueValuesSet);
  }
  




  export function getCountsForEvent(
    eventId: string,
    registrations: MaybePopulated<IRegistration, 'memberId' | 'eventId'>[],
    members: MaybePopulated<IMember, 'church'>[],
    caseType: 'Age Range' | 'Gender' | 'Church'
  ): number[] {
    // Filter registrations by eventId
    const filteredRegistrations = registrations.filter(
      reg => {
        if (typeof reg.eventId === 'object' && '_id' in reg.eventId) {
          return reg.eventId._id?.toString() === eventId;
        }
        return reg.eventId?.toString() === eventId;
      }
    );
  
    // Extract memberIds from filtered registrations
    const memberIds = filteredRegistrations
      .map(reg => {
        if (typeof reg.memberId === 'object' && '_id' in reg.memberId) {
          return reg.memberId._id.toString();
        }
        return reg.memberId?.toString();
      })
      .filter((id): id is string => !!id);
  
    // Filter members using the collected memberIds
    const filteredMembers = members.filter(member => memberIds.includes(member._id.toString()));
  
    // Create a map to store counts for each unique value
    const counts: Record<string, number> = {};
  
    // Count based on caseType
    switch (caseType) {
      case 'Church':
        filteredMembers.forEach(member => {
          if (
            typeof member.church !== 'string' &&
            !(member.church instanceof mongoose.Types.ObjectId) &&
            member.church.name
          ) {
            counts[member.church.name] = (counts[member.church.name] || 0) + 1;
          }
        });
        break;
  
      case 'Age Range':
        filteredMembers.forEach(member => {
          if (member.ageRange) {
            counts[member.ageRange] = (counts[member.ageRange] || 0) + 1;
          }
        });
        break;
  
      case 'Gender':
        filteredMembers.forEach(member => {
          if (member.gender) {
            counts[member.gender] = (counts[member.gender] || 0) + 1;
          }
        });
        break;
  
      default:
        throw new Error(`Invalid caseType: ${caseType}`);
    }
  
    // Return only the counts as an array
    return Object.values(counts);
  }
  



  export function getCountsForEventByCase(
    eventId: string,
    registrations: MaybePopulated<IRegistration, 'memberId' | 'eventId' | 'groupId'>[],
    members: MaybePopulated<IMember, 'church'>[],
    caseType: 'Church' | 'Individuals' | 'Groups'
  ): number {
    // Filter registrations by eventId
    const filteredRegistrations = registrations.filter(
      reg => {
        if (typeof reg.eventId === 'object' && '_id' in reg.eventId) {
          return reg.eventId._id?.toString() === eventId;
        }
        return reg.eventId?.toString() === eventId;
      }
    );
  
    // Initialize result variable
    let result = 0;
  
    // Handle different case types
    switch (caseType) {
      case 'Church':
        // Count distinct churches
        const distinctChurches = new Set<string>();
        filteredRegistrations.forEach(reg => {
          // Safely handle memberId of type string, ObjectId, or IMember
          const memberId = typeof reg.memberId === 'string' || reg.memberId instanceof mongoose.Types.ObjectId
            ? reg.memberId.toString()
            : reg.memberId?._id.toString(); // Access _id if memberId is an IMember
    
          if (memberId) {
            const member = members.find(m => m._id.toString() === memberId);
            if (member && member.church && typeof member.church !== 'string' && !(member.church instanceof mongoose.Types.ObjectId)) {
              distinctChurches.add(member.church.name);
            }
          }
        });
        result = distinctChurches.size;
        break;
  
      case 'Individuals':
        // Count individuals (registrations without groups)
        const individualsCount = filteredRegistrations.filter(reg => !reg.groupId).length;
        result = individualsCount;
        break;
  
      case 'Groups':
        // Count distinct groups
        const distinctGroups = new Set<string>();
        filteredRegistrations.forEach(reg => {
          if (reg.groupId) {
            distinctGroups.add(reg.groupId.toString());
          }
        });
        result = distinctGroups.size;
        break;
  
      default:
        throw new Error(`Invalid caseType: ${caseType}`);
    }
  
    return result;
  }
  