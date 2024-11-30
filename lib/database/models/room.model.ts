import mongoose, { model, models } from "mongoose";
import { Document, Schema } from "mongoose";
import { IEvent } from "./event.model";

export interface IRoom extends Document {
    _id:string;
    venue:string,
    floor?:string,
    number?:string,
    nob?:number,
    roomType?:string,
    bedType?:string,
    features?:string,
    full:boolean,
    eventId:mongoose.Types.ObjectId | string | IEvent,
    createdAt?:Date,
    updatedAt?:Date,
}

const RoomSchema = new Schema<IRoom>({
    venue:{type:String, required:true},
    floor:String,
    number:String,
    nob:{type:Number, default:1},
    full:{type:Boolean, default:false},
    roomType:String,
    bedType:String,
    features:String,
    eventId:{type:Schema.Types.ObjectId, ref:'Event', required:true}
},{timestamps:true})


const Room = models?.Room || model('Room', RoomSchema);
export default Room;