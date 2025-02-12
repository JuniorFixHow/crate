import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRelationship } from "@/lib/database/models/relationship.model";


export type ConvertibleRelationship = 'Child' | 'Children' | 'Parent' | 'Entire family' | 'Extended family'

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


export const getOtherUserFirst = (members:IMember[], memb:IMember):IMember=>{
    // const memb = members[0];
    const member = members.filter((item)=>item?._id !== memb?._id)[0];
    return member;
}


export const getRelationValue = (members:IMember[], memb:IMember, type:ConvertibleRelationship):string=>{
    const first = members[0];
    if(first?._id !== memb?._id ){
        if(type === 'Child' || type === 'Children'){
            return 'Parent'
        }else if(type === 'Parent'){
            return 'Child'
        }else if(type === 'Entire family' || type === 'Extended family'){
            return 'Family member'
        }else{
            return type;
        }
    }else{
        return type;
    }
}