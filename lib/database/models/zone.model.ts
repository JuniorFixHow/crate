import { Document, model, models, Schema } from "mongoose"


export interface IZone extends Document {
    _id:string;
    name: string;
    country?: string;
    state?: string;
    registrants?: number;
    coordinators?: number;
    volunteers?: number;
    admins?: number;
    churches?: number;
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
}

const ZoneSchema = new Schema<IZone>({
    name:{type:String, required:true},
    country:{type:String},
    state:{type:String},
    registrants:{type:Number, default:0},
    coordinators:{type:Number, default:0},
    volunteers:{type:Number, default:0},
    admins:{type:Number, default:0},
    churches:{type:Number, default:0},
},{timestamps:true});




const Zone = models?.Zone || model('Zone', ZoneSchema);
export default Zone;