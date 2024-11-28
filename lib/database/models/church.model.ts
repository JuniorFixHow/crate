import mongoose, { Document, model, models, Schema } from "mongoose";
import { IZone } from "./zone.model";


export interface IChurch extends Document {
    _id:string,
    name: string;
    pastor?: string;
    zoneId: mongoose.Types.ObjectId | string | IZone; // ObjectId as a string
    registrants?: number;
    youth?: number;
    coordinators?: number; // Fixed spelling from "coodintors" to "coordinators"
    volunteers?: number;
    admins?: number;
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
}

const ChurchSchema = new Schema<IChurch>({
    name:{type:String, required:true},
    pastor:String,
    zoneId:{type:Schema.Types.ObjectId, ref:'Zone', required:true},
    registrants:{type:Number, default:0},
    youth:{type:Number, default:0},
    coordinators:{type:Number, default:0},
    volunteers:{type:Number, default:0},
    admins:{type:Number, default:0},
},{timestamps:true})




const Church = models?.Church || model('Church', ChurchSchema);

export default Church