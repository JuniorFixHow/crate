import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IGroup } from "./group.model";
import { IRoom } from "./room.model";
import { IEvent } from "./event.model";
import Payment from "./payment.model";
import { IKey } from "./key.model";
import { IChurch } from "./church.model";
import Hubclass from "./hubclass.model";

export interface IRegistration extends Document{
    _id:string;
    memberId:Types.ObjectId | string | IMember;
    badgeIssued:'Yes'|'No';
    groupId?:Types.ObjectId | string | IGroup;
    roomIds?:[Types.ObjectId] | string[] | IRoom[];
    eventId:Types.ObjectId | string | IEvent;
    churchId:Types.ObjectId | string | IChurch;
    keyId:Types.ObjectId | string | IKey;
    checkedIn:{
        checked:boolean;
        date:string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
    memberId:{type:Schema.Types.ObjectId, ref:'Member', required:true},
    badgeIssued:{type:String, default:'No'},
    checkedIn:{checked:Boolean, date:String},
    groupId:{type:Schema.Types.ObjectId, ref:'Group', required:false},
    keyId:{type:Schema.Types.ObjectId, ref:'Key', required:false},
    roomIds:[{type:Schema.Types.ObjectId, ref:'Room', required:false}],
    eventId:{type:Schema.Types.ObjectId, ref:'Event', required:true},
    churchId:{type:Schema.Types.ObjectId, ref:'church'},

},{timestamps:true});

RegistrationSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    try {
      const query = this.getQuery();
      const regId = query._id;
  
      // Look up the registration to get the memberId
      const registration = await this.model.findOne({ _id: regId }).lean() as IRegistration|null;
      if (!registration) return next();
  
      const payerId = registration.memberId;
  
      // Delete related payments
      await Payment.deleteMany({ payer: payerId });
  
      // Remove this registration from any Hubclass children arrays
      await Hubclass.updateMany(
        { children: regId },
        { $pull: { children: regId } }
      );
  
      next();
    } catch (error) {
      console.error('Error in Registration pre-deleteOne hook:', error);
      next(error as CallbackError);
    }
  });
  

const Registration = models?.Registration || model('Registration', RegistrationSchema);
export default Registration;