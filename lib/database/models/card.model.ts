import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IChurch } from "./church.model";

export interface ICard extends Document{
    _id:string;
    // type:string;
    // name:string;
    member:string | Types.ObjectId | IMember;
    churchId:string | Types.ObjectId | IChurch;
    expDate:string;
    lastPrinted:string;
    createdAt:Date;
    updatedAt:Date;
}

const CardSchema = new Schema<ICard>({
    // type:String,
    lastPrinted:String,
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
    member:{type:Schema.Types.ObjectId, ref:'Member'},
    expDate:String,
}, {timestamps:true});

const Card = models?.Card || model('Card', CardSchema);

export default Card;