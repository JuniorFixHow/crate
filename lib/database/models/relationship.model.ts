import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IChurch } from "./church.model";

export interface IRelationship extends Document{
    _id:string;
    type:string;
    title:string;
    description:string;
    members:string[] | IMember[] | Types.ObjectId[];
    churchId: string | IChurch | Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const RelationshipSchema = new Schema<IRelationship>({
    title:String,
    type:String,
    description:String,
    members:[{type:Schema.Types.ObjectId, ref:'Member'}],
    churchId:{type:Schema.Types.ObjectId, ref:'Church'}
},{timestamps:true});

const Relationship = models?.Relationship || model('Relationship', RelationshipSchema);
export default Relationship;