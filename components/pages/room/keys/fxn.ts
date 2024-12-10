import { IKey } from "@/lib/database/models/key.model";

export const SearchKey = (keys:IKey[], search:string, roomId:string):IKey[]=>{
    const data = keys
    .filter((key)=>{
        if(typeof key.roomId === 'object')
        return roomId === '' ? key : key.roomId._id === roomId 
    })
    .filter((key)=>{
        return search === '' ? key : Object.values(key)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}