import mongoose, { CallbackError, Document, model, models, Schema } from "mongoose";
import { IChurch } from "./church.model";
import { IVendor } from "./vendor.model";
import Response from "./response.model";

export interface IMember extends Document{
    _id:string;
    photo:string;
    email:string;
    name:string;
    ageRange:string;
    church:mongoose.Types.ObjectId | string | IChurch;
    registeredBy:mongoose.Types.ObjectId | string | IVendor;
    gender:string;
    phone?:string;
    dietary?:string;
    note?:string,
    marital?:string,
    allergy?:string,
    employ?:string,
    status:string;
    password:string;
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; //
}

const MemberSchema = new Schema<IMember>({
    photo:{type:String, default:'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'},
    email:{type:String, unique:true},
    name:{type:String, required:true},
    ageRange:String,
    church:{type:Schema.Types.ObjectId, ref:'Church', required:true},
    registeredBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:true},
    gender:String,
    phone:String,
    dietary:String,
    allergy:String,
    note:String,
    marital:String,
    employ:String,
    password:String,
    status:String,
},{timestamps:true});

MemberSchema.pre('deleteOne', {document: false, query: true}, async function(next){
    try {
        const memberId = this.getQuery()._id;
        await Response.deleteMany({memberId});
        next();
    } catch (error) {
        console.log(error)
        next(error as CallbackError)
    }
})

const Member = models?.Member || model('Member', MemberSchema);
export default Member;