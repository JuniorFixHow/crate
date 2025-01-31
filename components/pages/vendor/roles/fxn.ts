import { IVendor } from "@/lib/database/models/vendor.model";

export const SearchUserReversed = (users:IVendor[], search:string):IVendor[]=>{
    const data = users?.filter((user)=>{
        return search === '' ? null : Object.values(user)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });

    return data;
}