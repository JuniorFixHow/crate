import { ICampuse } from "@/lib/database/models/campuse.model";
import { IChurch } from "@/lib/database/models/church.model";
import { IZone } from "@/lib/database/models/zone.model";

export const SearchCampuseWithEverything = (
    campuses:ICampuse[], zoneId:string, churchId:string,
    search:string
):ICampuse[]=>{
    const data = campuses
    .filter((item)=>{
        const church = item.churchId as IChurch;
        const zone = church?.zoneId as IZone;
        return zoneId === '' ? item : zone._id === zoneId
    })
    .filter((item)=>{
        const church = item.churchId as IChurch;
        return churchId === '' ? item : church._id === churchId
    })
    .filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}

export const SearchCampuseWithoutZone = (
    campuses:ICampuse[], churchId:string,
):ICampuse[]=>{
    const data = campuses
    .filter((item)=>{
        const church = item.churchId as IChurch;
        return churchId === '' || churchId === undefined ? item : church._id === churchId
    })
    

    return data;
}