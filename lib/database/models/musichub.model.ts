import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { IChurch } from "./church.model";
import { IVendor } from "./vendor.model";
import Event from "./event.model";

export interface IMusichub extends Document{
    _id:string;
    title:string;
    contact:string;
    email:string;
    nature:'Individual'|'Group';
    type:'Choir'|'Singing Band'|'Quartets'|'Choral Group'|'Youth Choir'|'Musician'|'Instrumentalists';
    appearance:'First time'|'1 - 2 times' | 'More than 2';
    affiliation:'NAGACU'|'NAGASBU'|'NAGASGA'|'Youth Choir Union'|'No Affliations'|'Guest';
    churchId:string|Types.ObjectId|IChurch;
    createdBy:string|Types.ObjectId|IVendor;
    createdAt:Date;
    updatedAt:Date;
}

const MusicHubSchema = new Schema<IMusichub>({
    title:{type:String, required:true},
    contact:{type:String, required:true},
    email:{type:String, required:true},
    nature:{type:String, required:true},
    type:{type:String, required:true},
    appearance:{type:String, required:true},
    affiliation:{type:String, required:true},
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor'},
},{timestamps:true})

MusicHubSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
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
  

const MusicHub = models?.Musichub || model('Musichub', MusicHubSchema);
export default MusicHub;