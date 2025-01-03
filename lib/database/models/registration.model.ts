import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IGroup } from "./group.model";
import { IRoom } from "./room.model";
import { IEvent } from "./event.model";
import Payment from "./payment.model";

export interface IRegistration extends Document{
    _id:string;
    memberId:Types.ObjectId | string | IMember;
    badgeIssued:'Yes'|'No';
    groupId?:Types.ObjectId | string | IGroup;
    roomIds?:[Types.ObjectId] | string[] | IRoom[];
    eventId:Types.ObjectId | string | IEvent;
    createdAt?: Date;
    updatedAt?: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
    memberId:{type:Schema.Types.ObjectId, ref:'Member', required:true},
    badgeIssued:{type:String, default:'No'},
    groupId:{type:Schema.Types.ObjectId, ref:'Group', required:false},
    roomIds:[{type:Schema.Types.ObjectId, ref:'Room', required:false}],
    eventId:{type:Schema.Types.ObjectId, ref:'Event', required:true},

},{timestamps:true});

RegistrationSchema.pre('deleteOne', {document:false, query:true}, async function(next){
    try {
        const payerId = this.getQuery()._id;
        await Payment.deleteMany({payer:payerId});
        next();
    } catch (error) {
        console.log(error);
    }
})

const Registration = models?.Registration || model('Registration', RegistrationSchema);
export default Registration;