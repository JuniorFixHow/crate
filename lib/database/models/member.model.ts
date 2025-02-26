import mongoose, { CallbackError, Document, model, models, Schema, UpdateQuery } from "mongoose";
import { IChurch } from "./church.model";
import { IVendor } from "./vendor.model";
import Response from "./response.model";
import Campuse, { ICampuse } from "./campuse.model";

export interface IMember extends Document{
    _id:string;
    photo:string;
    email:string;
    name:string;
    ageRange:string;
    church:mongoose.Types.ObjectId | string | IChurch;
    campuseId:mongoose.Types.ObjectId | string | ICampuse;
    registeredBy:mongoose.Types.ObjectId | string | IVendor;
    gender:string;
    phone?:string;
    dietary?:string;
    note?:string,
    marital?:string,
    allergy?:string,
    employ?:string,
    status:string;
    voice:string;
    role:string;
    roles:string[];
    password:string;
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; //
}

const MemberSchema = new Schema<IMember>({
    photo:{type:String, default:'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'},
    email:{type:String},
    name:{type:String, required:true},
    ageRange:String,
    church:{type:Schema.Types.ObjectId, ref:'Church', required:true},
    registeredBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:true},
    campuseId:{type:Schema.Types.ObjectId, ref:'Campus', required:true},
    gender:String,
    phone:String,
    dietary:String,
    allergy:String,
    note:String,
    marital:String,
    voice:String,
    employ:String,
    password:String,
    status:String,
    role:String,
    roles:[String],
},{timestamps:true});

MemberSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    try {
        const memberId = this.getQuery()?._id; // Get the member ID from the query
        const campuseId = this.getQuery()?.campuseId; // Get the campuse ID from the query

        if (!memberId) {
            throw new Error('Member ID is required for delete operation');
        }

        const operations = [
            Response.deleteMany({ memberId }), // Delete all responses linked to this member
        ];

        if (campuseId) {
            // Remove the member from the Campuse members array
            operations.push(
                Campuse.findByIdAndUpdate(campuseId, { $pull: { members: memberId } })
            );
        }

        await Promise.all(operations); // Run all operations concurrently
        next();
    } catch (error) {
        console.error('Error occurred during pre-deleteOne hook:', error);
        next(error as CallbackError);
    }
});


MemberSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate() as UpdateQuery<unknown>; // Explicitly cast to UpdateQuery
        const campuseId = update?.campuseId; // Get `campuseId` from the update object
        const memberId = this.getQuery()?._id; // Get the `_id` from the query

        if (campuseId && memberId) {
            await Campuse.findByIdAndUpdate(campuseId, {
                $push: { members: memberId },
            });
        }

        next();
    } catch (error) {
        console.error('Error updating Campuse:', error);
        next(error as CallbackError);
    }
});





MemberSchema.post('save', async function (doc, next) {
    try {
        const memberId = doc._id;
        const campuseId = doc.campuseId; // Assuming `campuseId` exists on the Member document

        if (campuseId) {
            await Campuse.findByIdAndUpdate(campuseId, {
                $push: { members: memberId },
            });
        }

        next();
    } catch (error) {
        console.error('Error updating Campuse:', error);
        // next(error);
    }
});


const Member = models?.Member || model('Member', MemberSchema);
export default Member;