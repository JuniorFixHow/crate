import { Document, model, models, Schema, Types } from "mongoose";
import { IVendor } from "./vendor.model";
import { IEvent } from "./event.model";


export interface ISession extends Document {
    _id:string;
    name?: string;
    venue?: string;
    from: string;
    to: string;
    type:string;
    eventId: Types.ObjectId | string | IEvent; // Reference to the Event
    createdBy: Types.ObjectId | string | IVendor; // Reference to the Vendor
    createdAt?: Date; // Automatically added by Mongoose
    updatedAt?: Date; // Automatically added by Mongoose
}

const SessionSchema = new Schema<ISession>({
    name:String,
    venue:String,
    type:{type:String, default:'Adult'},
    from:{type:String, required:true},
    to:{type:String, required:true},
    eventId:{type:Schema.Types.ObjectId, ref:'Event', required:true},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:true}
},{timestamps:true})

const Session = models?.Session || model('Session', SessionSchema);
export default Session;
