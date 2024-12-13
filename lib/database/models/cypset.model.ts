import { CallbackError, model, models, Schema, Types } from "mongoose";
import { IVendor } from "./vendor.model";
import Section, { ISection } from "./section.model";
import { IEvent } from "./event.model";

export interface ICYPSet extends Document{ 
    _id:string;
    createdBy:string|Types.ObjectId|IVendor;
    sections:ISection[]|[Types.ObjectId]|string[];
    published:boolean,
    eventId:IEvent|Types.ObjectId|string;
    title:string,
    createdAt?:Date;
    updatedAt?:Date; 
}


const CYPSetSchema =  new Schema<ICYPSet>({
    title:String,
    published:{type:Boolean, default:false},
    sections:[{type:Schema.Types.ObjectId, ref:'Section'}],
    eventId:{type:Schema.Types.ObjectId, ref:'Event', required:true},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:true},
},{timestamps:true})


CYPSetSchema.pre('deleteOne', {document:true, query:false}, async function (next) {
    try {
        const cypsetId = this._id;
        await Section.deleteMany({cypsetId});
        next();
    } catch (error) {
        next(error as CallbackError)
        console.log(error);
    }
})


const CYPSet = models?.CYPSet || model('CYPSet', CYPSetSchema);
export default CYPSet