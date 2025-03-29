import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IEvent } from "./event.model";

export interface IHubclass extends Document{
    _id:string;
    title:string;
    children:string[] | IMember[] | Types.ObjectId[];
    leaders:string[] | IMember[] | Types.ObjectId[];
    eventId:string | IEvent | Types.ObjectId;
    createdAt:Date;
    updatedAt:Date
}

const HubclassSchema = new Schema<IHubclass>({
    title:String,
    children:[{type:Schema.Types.ObjectId, ref:'Member'}],
    leaders:[{type:Schema.Types.ObjectId, ref:'Member'}],
    eventId:{type:Schema.Types.ObjectId, ref:'Event'}
},{timestamps:true})


const Hubclass = models?.Hubclasses || model('IHubClass', HubclassSchema);
export default Hubclass