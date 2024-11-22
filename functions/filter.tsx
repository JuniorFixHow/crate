import { MemberProps } from "@/types/Types";

export const getUniqueValues = (filter: string, members:MemberProps[]): string[] => {
    switch (filter) {
        case 'Age':
            return Array.from(new Set(members.map(member => member.ageRange))).sort((a, b)=>a > b ? 1: -1);
        case 'Country':
            return Array.from(new Set(members.map(member => member.country)));
        case 'Church':
            return Array.from(new Set(members.map(member => member.church)));
        case 'Gender':
            return Array.from(new Set(members.map(member => member.gender)));
        case 'Registered By':
            return Array.from(new Set(members.map(member => member.registeredBy)));
        case 'Registration Type':
            return Array.from(new Set(members.map(member => member.registerType)));
        default:
            return [];
    }
};



export const countMembers = (filter: string, members:MemberProps[]): number[] => {
    const countMap: Record<string, number> = {};

    members.forEach(member => {
        let value: string;
        switch (filter) {
            case 'Age':
                value = member.ageRange;
                break;
            case 'Country':
                value = member.country;
                break;
            case 'Church':
                value = member.church;
                break;
            case 'Gender':
                value = member.gender;
                break;
            case 'Registered By':
                value = member.registeredBy;
                break;
            case 'Registration Type':
                value = member.registerType;
                break;
            default:
                return;
        }

        countMap[value] = (countMap[value] || 0) + 1;
    });

    return Object.values(countMap);
};


export const getMales =(members:MemberProps[]):string =>{
    const males = members.filter((m)=>m.gender === 'Male').length;
    const percent = ((males/members.length)*100).toFixed();
    return `(${males}) ${percent}%`
}

export const getFemales =(members:MemberProps[]):string =>{
    const females = members.filter((m)=>m.gender === 'Female').length;
    const percent = ((females/members.length)*100).toFixed();
    return `(${females}) ${percent}%`
}

export const getMaleValue =(members:MemberProps[]):number =>{
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

