import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IChurch } from "./church.model";
import { IVendor } from "./vendor.model";

export interface IActivity extends Document{
    _id:string;
    type:string;
    name:string;
    leaders:string[] | Types.ObjectId[] | IMember[];
    members:string[] | Types.ObjectId[] | IMember[];
    churchId:string | Types.ObjectId | IChurch;
    frequency:string;
    startTime:string;
    endTime:string;
    startDate:string;
    endDate:string;
    description:string;
    creatorId:string | Types.ObjectId | IVendor;
    createdAt:Date;
    updatedAt:Date;
}

const ActivitySchema = new Schema<IActivity>({
    type:String,
    name:String,
    leaders:[{type:Schema.Types.ObjectId, ref:'Member'}],
    members:[{type:Schema.Types.ObjectId, ref:'Member'}],
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
    creatorId:{type:Schema.Types.ObjectId, ref:'Church'},
    frequency:String,
    startTime:String,
    endTime:String,
    startDate:String,
    endDate:String,
    description:String,
}, {timestamps:true});

const Activity = models?.Activity || model('Activity', ActivitySchema);

export default Activity;