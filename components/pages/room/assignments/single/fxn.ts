import { RoomProps } from "@/types/Types";

export const SearchRoomWithoutEvent = (rooms:RoomProps[], search:string):RoomProps[]=>{
    const data = rooms.filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })
    return data;
}