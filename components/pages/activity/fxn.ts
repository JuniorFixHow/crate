import { IActivity } from "@/lib/database/models/activity.model";
import { IChurch } from "@/lib/database/models/church.model";

export const SearchActivityWithChurch = (activities:IActivity[],  churchId:string):IActivity[]=>{
    const data = activities
    ?.filter((item)=>{
        const church = item.churchId as IChurch;
        return (churchId === '' || churchId === undefined) ? item : church?._id === churchId
    });

    return data;
}


export const SearchActivityWithoutChurch = (activities:IActivity[], search:string):IActivity[]=>{
    const data = activities
    ?.filter((item)=>{
        return search === '' ?  item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });

    return data;
}