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

// const lastSevenDays = getLastSevenDays();
// console.log(lastSevenDays);