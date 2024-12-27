import { IService } from "@/lib/database/models/service.model";

export const SearchServices = (services:IService[], search:string):IService[]=>{
    const data = services.filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });

    return data;
}