import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { IVendor } from "./vendor.model";
import CYPSet from "./cypset.model";
import { IChurch } from "./church.model";

export interface IEvent extends Document {
    _id:string
    name: string;
    location?: string;
    from?: string;
    to?: string;
    type: 'Convention' | 'Camp Meeting - Adult' | 'Conference' | 'Retreat' | 'Camp Meeting - YAYA' | 'Camp Meeting - Children';
    organizers: 'NAGACU' | 'NAGSDA' | 'Church';
    note?: string;
    forAll: boolean;
    adultPrice?: number;
    childPrice?: number;
    sessions?: number;
    createdBy: Types.ObjectId|string|IVendor; // Assuming createdBy references a Vendor
    churchId: Types.ObjectId|string|IChurch;
    createdAt?: Date; // Automatically added by Mongoose
    updatedAt?: Date; // Automatically added by Mongoose
}

const EventSchema = new Schema<IEvent>({
    name:{type:String, required:true},
    location:String,
    from:String,
    to:String,
    type:String,
    organizers:String,
    note:String,
    forAll:{type:Boolean, default:false},
    adultPrice:{type:Number, default:0},
    childPrice:{type:Number, default:0},
    sessions:{type:Number, default:0},
    churchId:{type:Schema.Types.ObjectId, ref:'Church', required:false},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:false}
},{timestamps:true})

EventSchema.pre('deleteOne', {document: false, query: true}, async function(next){
    try {
        const eventId = this.getQuery()._id;
        await CYPSet.deleteMany({eventId});
        next();
    } catch (error) {
        console.log(error);
        next(error as CallbackError)
    }
})

const Event = models?.Event || model('Event',EventSchema);
export default Event;