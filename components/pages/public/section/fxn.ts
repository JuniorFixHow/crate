import { ICYPSet } from "@/lib/database/models/cypset.model";
import { ISection } from "@/lib/database/models/section.model";

export const SearchSet = (sets:ICYPSet[], search:string):ICYPSet[]=>{
    const data = sets
    .filter((set)=>{
        return search === '' ? set : Object.values(set)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });
    return data
}


export const SearchSection = (sets:ISection[], search:string):ISection[]=>{
    const data = sets
    .filter((set)=>{
        return search === '' ? set : Object.values(set)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });
    return data
}

export const SearchSectionWithSet = (sets:ISection[], search:string, cypsetId:string):ISection[]=>{
    const data = sets
    .filter((set)=>{
        if(typeof set.cypsetId === 'object'){
            return cypsetId === '' ? set : set.cypsetId._id.toString() === cypsetId;
        }
    })
    .filter((set)=>{
        return search === '' ? set : Object.values(set)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });
    return data
}

export const SearchSectionWithSetV2 = (sets:ISection[], cypsetId:string):ISection[]=>{
    const data = sets
    .filter((set)=>{
        const cyp = set?.cypsetId as ICYPSet;
        return cypsetId === '' ? set : cyp?._id === cypsetId;
    })
    return data
}

