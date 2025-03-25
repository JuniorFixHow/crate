import { SessionPayload } from "@/lib/session";
import { NavigationProps } from "@/types/Types";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { activityRoles, campusRoles, churchRoles, contractRoles, eventRegistrationRoles, eventRoles, groupRoles, memberRoles, ministryRoles, paymentRoles, roomRoles, serviceRoles, userRoles, venueRoles, zoneRoles } from "@/components/auth/permission/permission";

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


export const formatDashboardLink = (text:string):number|string=>{
    if(
        (text.startsWith('0'))  || 
        (text.length === 2 && text.startsWith('$') &&  text.slice(1,text.length))
    ){
        return 0;
    }else{
        return text;
    }
}


export const generateNumberArray = (n: number): string[] => {
    return ["G", ...Array.from({ length: n - 1 }, (_, i) => (i + 1).toString())];
};


export const truncateText = (text: string, sm: number, md: number, lg: number) => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      const limit = width < 768 ? sm : width < 1024 ? md : lg; // Adjust breakpoints
      return text.length > limit ? text.slice(0, limit) + "..." : text;
    }
    return text;
  };




export const canAccessNavItem = (item: NavigationProps, user: SessionPayload) => {
    if (!user || !user.roles) return false; // Ensure user is logged in
    const isAdmin = checkIfAdmin(user);
    if(isAdmin) return true
  
    switch (item.title) {
      case "Members":
        return memberRoles.admin(user); // Example: Check if the user has read access to members
      case "Event Management":
        return eventRoles.admin(user) || eventRegistrationRoles.admin(user); 
      case "User Management":
        return userRoles.admin(user);
      case "Groups/Family":
        return groupRoles.admin(user);
      case "Venues/Rooms":
        return venueRoles.admin(user) || roomRoles.admin(user);
      case "Communities":
        return zoneRoles.admin(user) || churchRoles.admin(user) || campusRoles.admin(user);
      case "Ministries":
        return ministryRoles.admin(user) || activityRoles.admin(user);
      case "Contract Management":
        return contractRoles.admin(user) || serviceRoles.admin(user);
      case "Revenue":
        return paymentRoles.admin(user);
      default:
        return !item.isAdmin; // Show non-admin items by default
    }
  };


  export const getAgeCategory = (ageRange: string): "Child" | "Adult" | "Unknown" => {
    const ageGroups: Record<string, "Child" | "Adult"> = {
        "0-5": "Child",
        "6-10": "Child",
        "11-20": "Adult",
        "21-30": "Adult",
        "31-40": "Adult",
        "41-50": "Adult",
        "51-60": "Adult",
        "61+": "Adult"
    };

    return ageGroups[ageRange] || "Unknown";
};
