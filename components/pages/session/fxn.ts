import { ISession } from "@/lib/database/models/session.model";

export const minTime = (date:Date): string => {
    
    // Get the current date in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    // Get the current time in HH:MM format
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Combine date and time in the required format
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDateTime(dateInput: string | number | Date): string {
    const date = new Date(dateInput);
  
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
    const hh = String(hours).padStart(2, '0');
  
    return `${mm}/${dd}/${yyyy}, ${hh}:${minutes} ${ampm}`;
}
  

export const timeToString = (date:Date): string => {
    
    
    // Get the current date in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    // Get the current time in HH:MM format
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Combine date and time in the required format
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}


export function getTimeOfDay(datetime: Date | string): string {
    const date = typeof datetime === 'string' ? new Date(datetime) : datetime;

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
    }

    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
        return 'Morning';
    } else if (hours >= 12 && hours < 16) {
        return 'Afternoon';
    } else if (hours >= 16 && hours < 21) {
        return 'Evening';
    } else {
        return 'Dawn';
    }
}


export function getActivityStatus(start: Date | string, end: Date | string): 'Ongoing' | 'Upcoming' | 'Completed' {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now >= startDate && now <= endDate) {
        return 'Ongoing';
    } else if (now < startDate) {
        return 'Upcoming';
    } else {
        return 'Completed';
    }
}



export function formatTimeRange(start: Date | string, end: Date | string): string {
    const formatTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 0 hours to 12 for 12-hour format
        const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits for minutes

        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid start or end datetime');
    }

    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
}


export function getPercentage(part:number, whole:number):string{
    let percent:string;
    if(whole === 0){
        percent =  '0%'
    }else{
        const perc = Math.round(((part/whole)*100));
        percent = `${perc}%`
    }
    return percent;
}


export const searchSessionWithEvent=(sessions:ISession[], eventId:string):ISession[] =>{
    const data = sessions.filter((item)=>{
        if(typeof item.eventId === 'object'){
            return eventId === '' ? item : item.eventId._id.toString() === eventId
        }
    })
    return data;
}

export function isLate(inputDate: Date | string): 'Yes' | 'No' {
    const currentTime = new Date();
    const comparisonTime = new Date(inputDate);

    if (isNaN(comparisonTime.getTime())) {
        throw new Error('Invalid date format');
    }

    return comparisonTime < currentTime ? 'Yes' : 'No';
}


export const getJustTime = (dateTime: Date | string): string => {
    const date = new Date(dateTime);
    
    // Get hours and minutes
    let hours: number = date.getHours();
    const minutes: string = String(date.getMinutes()).padStart(2, '0');

    // Determine AM or PM suffix
    const ampm: string = hours >= 12 ? 'pm' : 'am';
    
    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    return `${hours}:${minutes} ${ampm}`;
};