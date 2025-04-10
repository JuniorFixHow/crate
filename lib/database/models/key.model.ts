import { Document, model, models, Schema, Types } from "mongoose";
import { IRoom } from "./room.model";
import { IRegistration } from "./registration.model";

export interface IKey extends Document{
    _id:string,
    code:string,
    returned:boolean,
    assignedOn:string,
    returnedDate:Date,
    roomId:Types.ObjectId | string | IRoom,
    holder:Types.ObjectId | string | IRegistration,
    createdAt:Date,
    updatedAt:Date,
}

const KeySchema = new Schema<IKey>({
    code:String,
    returned:{type:Boolean, default:false},
    returnedDate:Date,
    assignedOn:String,
    roomId:{type: Schema.Types.ObjectId, ref:'Room', required:true},
    holder:{type: Schema.Types.ObjectId, ref:'Registration'}
}, {timestamps:true})


const Key = models?.Key || model('Key', KeySchema);
export default Key;