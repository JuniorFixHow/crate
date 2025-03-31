import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IEvent } from "./event.model";
import Childrenrole from "./childrenrole.model";
import { IChurch } from "./church.model";

export interface IHubclass extends Document{
    _id:string;
    title:string;
    children:string[] | IMember[] | Types.ObjectId[];
    leaders:string[] | IMember[] | Types.ObjectId[];
    eventId:string | IEvent | Types.ObjectId;
    churchId:string | IChurch | Types.ObjectId;
    createdAt:Date;
    updatedAt:Date
}

const HubclassSchema = new Schema<IHubclass>({
    title:String,
    children:[{type:Schema.Types.ObjectId, ref:'Member'}],
    leaders:[{type:Schema.Types.ObjectId, ref:'Member'}],
    eventId:{type:Schema.Types.ObjectId, ref:'Event'},
    churchId:{type:Schema.Types.ObjectId, ref:'Church'}
},{timestamps:true})


HubclassSchema.pre('deleteOne', {document:false, query:true}, async function(next) {
    try {
        const classId = this.getQuery()._id;
        await Childrenrole.deleteMany({classId});
        next();
    } catch (error) {
        console.log(error);
        next(error as CallbackError)
    }
})

const Hubclass = models?.Hubclasses || model('HubClass', HubclassSchema);
export default Hubclass