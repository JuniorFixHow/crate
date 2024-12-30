import { IFacility } from "@/lib/database/models/facility.model";

export const SearchFacility = (facilities:IFacility[], search:string):IFacility[]=>{
    const data = facilities.filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}