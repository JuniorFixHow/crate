import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IActivity } from "./activity.model";

export interface IMinistry extends Document{
    _id:string;
    name:string;
    startTime:string;
    endTime:string;
    description:string;
    activityId: string | IActivity | Types.ObjectId;
    churchId: string | IActivity | Types.ObjectId;
    members:IMember[] | string[] | Types.ObjectId[];
    leaders:IMember[] | string[] | Types.ObjectId[];
    createdAt:Date;
    updatedAt:Date;
}

const MinistrySchema = new Schema<IMinistry>({
    name:String,
    startTime:String,
    endTime:String,
    description:String,
    churchId:{type:Schema.Types.ObjectId, ref:'Church', required:true},
    activityId:{type:Schema.Types.ObjectId, ref:'Activity', required:true},
    leaders:[{type:Schema.Types.ObjectId, ref:'Member'}],
    members:[{type:Schema.Types.ObjectId, ref:'Member'}],
}, {timestamps:true});

const Ministry = models?.Ministry || model('Ministry', MinistrySchema);
export default Ministry;