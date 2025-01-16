import { IActivity } from "@/lib/database/models/activity.model";
import { IChurch } from "@/lib/database/models/church.model";

export const SearchActivityWithChurch = (activities:IActivity[], search:string, churchId:string):IActivity[]=>{
    const data = activities
    .filter((item)=>{
        const church = item.churchId as IChurch;
        return churchId === '' ? item : church._id === churchId
    })
    .filter((item)=>{
        return search === '' ?  item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });

    return data;
}