import { Document, model, models, Schema } from "mongoose";

export interface IService extends Document{
    _id:string,
    name:string,
    description:string,
    cost:number,
    createdAt:Date,
    updatedAt:Date,
}

const ServiceSchema = new Schema<IService>({
    name:String,
    description:String,
    cost:Number
}, {timestamps:true});

const Service = models?.Service || model('Service', ServiceSchema);
export default Service;