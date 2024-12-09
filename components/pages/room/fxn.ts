import { IRoom } from "@/lib/database/models/room.model";

export const SearchRoom = (rooms:IRoom[], search:string, eventId:string):IRoom[]=>{
    const data = rooms.filter((item)=>{
        if(typeof item.eventId === 'object'){
            return eventId === ''? item : item.eventId._id.toString() === eventId
        }
    }).filter((room)=>{
        return search === '' ? room : Object.values(room)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
    });
    return data;
}


export const SearchRoomWithoutEvent = (rooms:IRoom[], search:string):IRoom[]=>{
    const data = rooms
    .filter((room)=>{
        return search === '' ? room : Object.values(room)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}