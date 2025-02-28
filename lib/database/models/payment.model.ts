import { Document, model, models, Schema, Types } from "mongoose";
import { IRegistration } from "./registration.model";
import { IVendor } from "./vendor.model";
import { IChurch } from "./church.model";
import { IEvent } from "./event.model";

export interface IPayment extends Document{
    _id:string,
    payer:Types.ObjectId | IRegistration | string | null,
    payee:Types.ObjectId | IVendor | string,
    churchId:Types.ObjectId | IChurch | string,
    eventId:Types.ObjectId | IEvent | string,
    purpose:string,
    narration:string,
    dueAmount:number;
    amount:number,
    createdAt:Date,
    updatedAt:Date
}

const PaymentSchema = new Schema<IPayment>({
    payer:{
        type:Schema.Types.ObjectId, ref:'Registration', default:null
    },
    churchId:{
        type:Schema.Types.ObjectId, ref:'Church',
    },
    eventId:{
        type:Schema.Types.ObjectId, ref:'Event', required:true
    },
    payee:{
        type:Schema.Types.ObjectId, ref:'Vendor', required:true
    },
    purpose:String,
    narration:String,
    amount:Number,
    dueAmount:{type:Number, default:0},
},{timestamps:true});


const Payment = models?.Payment || model('Payment', PaymentSchema);
export default Payment;