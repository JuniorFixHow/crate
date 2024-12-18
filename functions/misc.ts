export const getPassword = (text1:string, text2:string):string=>{
    const first = text1?.split(' ')[0];
    const second = text2.trim().slice(-5);
    const password = first + second;
    return password;
}

export function isEligible(ageGroup: string): boolean {
    const eligibleGroups = ['6-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+'];
    return eligibleGroups.includes(ageGroup);
}