import { IFacility } from "@/lib/database/models/facility.model";
import { IVenue } from "@/lib/database/models/venue.model";

export const SearchVenueWithchurch =(venues:IVenue[], search:string, churchId:string):IVenue[]=>{
    const data = venues.filter((item)=>{
        return churchId === '' ? item : item.churchId === churchId
    })
    .filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });

    return data;
}

export const totalRoomsForVenue = (facilities:IFacility[]):number=>{
    const total = facilities.reduce((sum, facility)=> sum + Number(facility.rooms), 0);
    return total;
}