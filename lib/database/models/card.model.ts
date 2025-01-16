import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IChurch } from "./church.model";

export interface ICard extends Document{
    _id:string;
    type:string;
    name:string;
    members:string[] | Types.ObjectId[] | IMember[];
    churchId:string | Types.ObjectId | IChurch;
    expDate:string;
    createdAt:Date;
    updatedAt:Date;
}

const CardSchema = new Schema<ICard>({
    type:String,
    name:String,
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
    members:[{type:Schema.Types.ObjectId, ref:'Member'}],
    expDate:String,
}, {timestamps:true});

const Card = models?.Card || model('Card', CardSchema);

export default Card;