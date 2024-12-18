import { Document, model, models, Schema, Types } from "mongoose";
import { IEvent } from "./event.model";
import { IMember } from "./member.model";
import { IRoom } from "./room.model";

export interface IGroup extends Document{
    _id:string;
    name:string;
    groupNumber:number;
    eligible:number,
    type:'Family'|'Group'|'Couple';
    eventId:Types.ObjectId|string|IEvent;
    members:[Types.ObjectId]|string[]|IMember[];
    roomIds?:[Types.ObjectId]|string[]|IRoom[];
    createdAt?: Date;
    updatedAt?: Date;
}

const GroupSchema = new Schema<IGroup>({
    name:{type:String, required:true},
    groupNumber:{type: Number, required:true},
    eligible:{type: Number, required:true, default:0},
    type:String,
    eventId:{type:Schema.Types.ObjectId, ref:'Event', required:true},
    members:[{type:Schema.Types.ObjectId, ref:'Member'}],
    roomIds:[{type:Schema.Types.ObjectId, ref:'Room'}],

},{timestamps:true})

const Group = models?.Group || model('Group', GroupSchema);
export default Group