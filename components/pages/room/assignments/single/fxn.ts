import { IRoom } from "@/lib/database/models/room.model";

export const SearchRoomWithoutEvent = (rooms:IRoom[], search:string, nob:number|undefined):IRoom[]=>{
    const data = rooms.
    filter((item)=>{
        return (nob === 0|| nob === undefined) ? item : item.nob === nob
    }).
    filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })
    return data;
}