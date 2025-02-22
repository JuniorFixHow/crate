import { IClasssession } from "@/lib/database/models/classsession.model";
import { IMinistry } from "@/lib/database/models/ministry.model";

export const searchSessionWithClass=(sessions:IClasssession[], classId:string):IClasssession[] =>{
    const data = sessions?.filter((item)=>{
        const ministry = item?.classId as IMinistry;
        return classId === '' ? item : ministry?._id === classId
    })
    return data;
}