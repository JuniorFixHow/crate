import mongoose, { Document, model, models, Schema } from "mongoose";
import { IChurch } from "./church.model";
import { ICampuse } from "./campuse.model";

export interface IVendor extends Document {
    _id:string;
    name:string;
    image:string;
    email:string;
    phone:string;
    country:string,
    uid:string;
    password:string;
    roles:string[];
    church:mongoose.Types.ObjectId|string|IChurch;
    campusId:mongoose.Types.ObjectId|string|ICampuse;
    role:'Admin'|'Coordinator'|'Volunteer';
    gender:'Male'|'Female';
    registrants:number;
    createdAt?: Date;
    updatedAt?: Date;
}

const VendorSchema = new Schema<IVendor>({
    name:{type:String, required:true},
    image:{type:String, default:'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'},
    email:{type:String, required:true, unique:true},
    church:{type:Schema.Types.ObjectId, ref:'Church'},
    campusId:{type:Schema.Types.ObjectId, ref:'Campus'},
    role:String,
    country:String,
    uid:String,
    gender:String,
    phone:String,
    password:String,
    roles:[String],
    registrants:Number
},{timestamps:true})

const Vendor = models?.Vendor || model('Vendor', VendorSchema);
export default Vendor;

