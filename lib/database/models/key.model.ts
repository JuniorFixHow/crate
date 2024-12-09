import { Document, model, models, Schema, Types } from "mongoose";
import { IRoom } from "./room.model";
import { IMember } from "./member.model";

export interface IKey extends Document{
    _id:string,
    code:string,
    roomId:Types.ObjectId | string | IRoom,
    holder:Types.ObjectId | string | IMember,
    createdAt?:Date,
    updatedAt?:Date,
}

const KeySchema = new Schema<IKey>({
    code:String,
    roomId:{type: Schema.Types.ObjectId, ref:'Room', required:true},
    holder:{type: Schema.Types.ObjectId, ref:'Member'}
}, {timestamps:true})


const Key = models?.Key || model('Key', KeySchema);
export default Key;