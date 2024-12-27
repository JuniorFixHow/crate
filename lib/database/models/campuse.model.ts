import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
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


CampuseSchema.post('deleteOne', { document: false, query: true }, async function (doc, next) {
    try {
        const campuseId = this.getQuery()?._id;
        if (campuseId) {
            await Member.updateMany({ campuseId }, { $unset: { campuseId: "" } });
        }
        next();
    } catch (error) {
        console.error('Error unsetting campuseId from members:', error);
        next(error as CallbackError);
    }
});


const Campuse = models?.Campus || model('Campus', CampuseSchema);
export default Campuse;