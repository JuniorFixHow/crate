import { RoomProps } from "@/types/Types";

export const SearchRoom = (rooms:RoomProps[], search:string, eventId:string):RoomProps[]=>{
    const data = rooms.filter((item)=>{
        return eventId === '' ? item : item.eventId === eventId
    }).filter((room)=>{
        return search === '' ? room : Object.values(room)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
    });
    return data;
}