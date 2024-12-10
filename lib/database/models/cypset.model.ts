import { model, models, Schema, Types } from "mongoose";
import { IVendor } from "./vendor.model";
import { IQuestion } from "./question.model";
import { IResponse } from "./response.model";

export interface ICYPSet extends Document{ 
    _id:string;
    createdBy:string|Types.ObjectId|IVendor;
    questions:IQuestion[]|[Types.ObjectId]|string[];
    responses:IResponse[]|[Types.ObjectId]|string[];
    published:boolean,
    title:string,
    createdAt?:Date;
    updatedAt?:Date; 
}


const CYPSetSchema =  new Schema<ICYPSet>({
    title:String,
    published:{type:Boolean, default:false},
    questions:[{type:Schema.Types.ObjectId, ref:'Question'}],
    responses:[{type:Schema.Types.ObjectId, ref:'Response'}],
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:true},
},{timestamps:true})


const CYPSet = models?.CYPSet || model('CYPSet', CYPSetSchema);
export default CYPSet