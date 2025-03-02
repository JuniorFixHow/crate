import { IFacility } from "@/lib/database/models/facility.model";

export const SearchFacilityWithChurch = (
    facilities:IFacility[], search:string, churchId:string
):IFacility[]=>{
    const data = facilities.
    filter((item)=>{
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

export const SearchFacilityWithChurchV2 = (
    facilities:IFacility[], churchId:string
):IFacility[]=>{
    const data = facilities.
    filter((item)=>{
        return churchId === '' ? item : item.churchId === churchId
    });

    return data;
}