import { IMusichub } from "@/lib/database/models/musichub.model";

export const SearchMusicHubs = (musics:IMusichub[], churchId:string):IMusichub[]=>{
    const data = musics.filter((item)=>{
        return (churchId === '' || churchId === undefined) ? item : item.churchId.toString() === churchId
    });
    return data;
}