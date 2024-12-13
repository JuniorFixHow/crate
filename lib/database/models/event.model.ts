import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { IVendor } from "./vendor.model";
import CYPSet from "./cypset.model";

export interface IEvent extends Document {
    _id:string
    name: string;
    location?: string;
    from?: string;
    to?: string;
    type?: 'Camp Meeting'|'Convension'|'CYP';
    note?: string;
    adultPrice?: number;
    childPrice?: number;
    sessions?: number;
    createdBy: Types.ObjectId|string|IVendor; // Assuming createdBy references a Vendor
    createdAt?: Date; // Automatically added by Mongoose
    updatedAt?: Date; // Automatically added by Mongoose
}

const EventSchema = new Schema<IEvent>({
    name:{type:String, required:true},
    location:String,
    from:String,
    to:String,
    type:String,
    note:String,
    adultPrice:Number,
    childPrice:Number,
    sessions:{type:Number, default:0},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:false}
},{timestamps:true})

EventSchema.pre('deleteOne', {document:true, query:false}, async function(next){
    try {
        const eventId = this._id;
        await CYPSet.deleteMany({eventId});
        next();
    } catch (error) {
        console.log(error);
        next(error as CallbackError)
    }
})

const Event = models?.Event || model('Event',EventSchema);
export default Event;