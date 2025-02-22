import { Document, model, models, Schema, Types } from "mongoose";
import { IVendor } from "./vendor.model";
import { IMinistry } from "./ministry.model";


export interface IClasssession extends Document {
    _id:string;
    name?: string;
    venue?: string;
    from: string;
    to: string;
    classId: Types.ObjectId | string | IMinistry; // Reference to the Event
    createdBy: Types.ObjectId | string | IVendor; // Reference to the Vendor
    createdAt: Date; // Automatically added by Mongoose
    updatedAt: Date; // Automatically added by Mongoose
}

const ClassSessionSchema = new Schema<IClasssession>({
    name:String,
    venue:String,
    from:{type:String, required:true},
    to:{type:String, required:true},
    classId:{type:Schema.Types.ObjectId, ref:'Ministry', required:true},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:true}
},{timestamps:true})

const CSession = models?.CSession || model('CSession', ClassSessionSchema);
export default CSession;
