import { IEvent } from "@/lib/database/models/event.model";
import { ITravelhub } from "@/lib/database/models/travelhub.model";

export const SearchTravlhub = (travellers:ITravelhub[], eventId:string):ITravelhub[]=>{
    const data = travellers.filter((item)=>{
        const event = item?.eventId as IEvent;
        return (eventId === '' || eventId === undefined) ? item : event?._id === eventId;
    })

    return data;
}