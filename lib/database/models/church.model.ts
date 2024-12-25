import mongoose, { Document, model, models, Schema, Types } from "mongoose";
import { IZone } from "./zone.model";
import Campuse, { ICampuse } from "./campuse.model";
import { SocialProps } from "@/components/pages/churches/new/ChurchDetails";
import { IVendor } from "./vendor.model";


export interface IChurch extends Document {
    _id:string,
    name: string;
    pastor?: string;
    zoneId: mongoose.Types.ObjectId | string | IZone; // ObjectId as a string
    registrants?: number;
    youth?: number;
    coordinators?: number; // Fixed spelling from "coodintors" to "coordinators"
    volunteers?: number;
    location:string,
    address:string,
    email:string,
    phone:string,
    logo:string,
    campuses:string[] | Types.ObjectId[] | ICampuse[];
    socials:SocialProps[];
    admins?: number;
    createdBy: mongoose.Types.ObjectId | string | IVendor; // ObjectId as a string
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
}

const ChurchSchema = new Schema<IChurch>({
    name:{type:String, required:true},
    pastor:String,
    location:String,
    address:String,
    email:String,
    phone:String,
    logo:String,
    campuses:[{type:Schema.Types.ObjectId, ref:'Campuse'}],
    zoneId:{type:Schema.Types.ObjectId, ref:'Zone', required:true},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor'},
    socials:[{id:String, name:String, link:String}],
    registrants:{type:Number, default:0},
    youth:{type:Number, default:0},
    coordinators:{type:Number, default:0},
    volunteers:{type:Number, default:0},
    admins:{type:Number, default:0},
},{timestamps:true})


ChurchSchema.pre('deleteOne', {document:false, query:true}, async function(next){
    const churchId = this.getQuery()._id;
    await Campuse.deleteMany({churchId});
    next();
})

const Church = models?.Church || model('Church', ChurchSchema);

export default Church