import { Document, model, models, Schema, Types } from "mongoose";
import { IRegistration } from "./registration.model";
import { IVendor } from "./vendor.model";
import { IChurch } from "./church.model";

export interface IPayment extends Document{
    _id:string,
    payer:Types.ObjectId | IRegistration | string,
    payee:Types.ObjectId | IVendor | string,
    churchId:Types.ObjectId | IChurch | string,
    purpose:string,
    narration:string,
    amount:number,
    createdAt:Date,
    updatedAt:Date
}

const PaymentSchema = new Schema<IPayment>({
    payer:{
        type:Schema.Types.ObjectId, ref:'Registration',
    },
    churchId:{
        type:Schema.Types.ObjectId, ref:'Church',
    },
    payee:{
        type:Schema.Types.ObjectId, ref:'Vendor', required:true
    },
    purpose:String,
    narration:String,
    amount:Number,
},{timestamps:true});


const Payment = models?.Payment || model('Payment', PaymentSchema);
export default Payment;