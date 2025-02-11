import { IChurch } from "@/lib/database/models/church.model";
import { IRelationship } from "@/lib/database/models/relationship.model";

export const SearchRelationship = (rels:IRelationship[], churchId:string, search:string):IRelationship[]=>{
    const data = rels?.filter((item)=>{
        const church = item?.churchId as IChurch;
        return churchId === '' ? item : church?._id === churchId
    })
    ?.filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}

export const SearchSingleRelationship = (rels:IRelationship[],  search:string):IRelationship[]=>{
    const data = rels
    ?.filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}