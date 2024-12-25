import { Document, model, models, Schema, Types } from "mongoose";
import Member, { IMember } from "./member.model";
import { IChurch } from "./church.model";
import { IVendor } from "./vendor.model";

export interface ICampuse extends Document {
    _id:string;
    name:string;
    members:string[] | Types.ObjectId[] | IMember[];
    churchId:string | Types.ObjectId | IChurch;
    type:'Adults'|'Children'|'Online';
    createdBy:string | Types.ObjectId | IVendor;
    createdAt:Date;
    updatedAt:Date;
}

const CampuseSchema = new Schema<ICampuse>({
    name:String,
    type:String,
    members:[{type:Schema.Types.ObjectId, ref:'Member'}],
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor'},
},{timestamps:true});


CampuseSchema.pre('deleteOne', {document:false, query:true}, async function(next){
    const campuseId = this.getQuery()._id;
    await Member.deleteMany({campuseId});
    next();
})

const Campuse = models?.Campuse || model('Campuse', CampuseSchema);
export default Campuse;