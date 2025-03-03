import { IEvent } from "@/lib/database/models/event.model";
import { IKey } from "@/lib/database/models/key.model";
import { IRoom } from "@/lib/database/models/room.model";

export const SearchKey = (keys:IKey[],  roomId:string, eventId:string):IKey[]=>{
    const data = keys
    ?.filter((item)=>{
        const room = item?.roomId as IRoom;
        const event = room?.eventId as IEvent;
        return eventId === '' ? item : event?._id === eventId
    })
    ?.filter((key)=>{
        const room = key.roomId as IRoom;
        return (roomId === '' || roomId === undefined) ? key : room?._id === roomId 
    })

    return data;
}