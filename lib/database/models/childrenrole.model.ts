import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IHubclass } from "./hubclass.model";
import { IEvent } from "./event.model";
import { IChurch } from "./church.model";


export interface IChildrenrole extends Document{
    _id:string;
    title:string;
    memberId:string | IMember | Types.ObjectId;
    classId:string | IHubclass | Types.ObjectId;
    eventId:string | IEvent | Types.ObjectId;
    churchId:string | IChurch | Types.ObjectId;
    createdAt:Date;
    updatedAt:Date
}

const ChildrenroleSchema = new Schema<IChildrenrole>({
    title:String,
    memberId:{type:Schema.Types.ObjectId, ref:'Member'},
    classId:{type:Schema.Types.ObjectId, ref:'HubClass'},
    eventId:{type:Schema.Types.ObjectId, ref:'Event'},
    churchId:{type:Schema.Types.ObjectId, ref:'Church'}
},{timestamps:true})


const Childrenrole = models?.Childrenroles || model('Childrenrole', ChildrenroleSchema);
export default Childrenrole