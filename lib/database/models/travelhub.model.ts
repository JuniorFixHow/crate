import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { IChurch } from "./church.model";
import { IVendor } from "./vendor.model";
import Event, { IEvent } from "./event.model";
import { IRegistration } from "./registration.model";

export interface ITravelhub extends Document{
    _id:string;
    regId:string|Types.ObjectId|IRegistration;
    depAirport:string;
    arrAirport:string;
    depTime:string;
    arrTime:string;
    arrTerminal:string;
    pickup:boolean;
    notes:string;
    eventId:string|Types.ObjectId|IEvent;
    churchId:string|Types.ObjectId|IChurch;
    createdBy:string|Types.ObjectId|IVendor;
    createdAt:Date;
    updatedAt:Date;
}

const TravelHubSchema = new Schema<ITravelhub>({
    depAirport:{type:String, required:true},
    arrAirport:{type:String, required:true},
    depTime:{type:String, required:true},
    arrTime:{type:String, required:true},
    arrTerminal:String,
    notes:String,
    pickup:{type:Boolean, default:false, required:true},
    regId:{type:Schema.Types.ObjectId, ref:'Registration'},
    eventId:{type:Schema.Types.ObjectId, ref:'Event'},
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor'},
},{timestamps:true})

TravelHubSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    try {
      const id = this.getQuery()._id;
      
      if (!id) return next(); // Safety check
  
      await Event.updateMany(
        { musichubs: id },
        { $pull: { musichubs: id } }
      );
  
      next();
    } catch (error) {
      console.log(error);
      next(error as CallbackError);
    }
  });
  

const TravelHub = models?.Travelhub || model('Travelhub', TravelHubSchema);
export default TravelHub;