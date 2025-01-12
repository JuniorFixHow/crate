export const today = ()=>{
    return new Date().toISOString().split('T')[0]
}

export function getLastSevenDays(): Date[] {
    const dates: Date[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date);
    }

    return dates; // Reverse the array to have today as the first element
}

export function formatTimestamp(isoDate: string): string {
    
    // Ensure the date is valid
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone:'UTC'
    });
}



