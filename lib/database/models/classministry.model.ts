import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { IChurch } from "./church.model";
import Activity from "./activity.model";
import Ministry from "./ministry.model";

export interface IClassministry extends Document{
    _id:string;
    title:string;
    churchId:string | IChurch | Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const ClassMinistrySchema = new Schema<IClassministry>({
    title:String,
    churchId:{type:Schema.Types.ObjectId, ref:'Church', required:true},
}, {timestamps:true})

ClassMinistrySchema.pre('deleteOne', {document:false, query:true}, async function (next) {
    try {
        const minId = this.getQuery()._id;
        const activities = await Activity.find(minId);
        const deleteOp = activities.map((item)=>(
            Ministry.deleteMany({activityId:item._id})
        ))
        deleteOp.push(Activity.deleteMany({minId}));
        await Promise.all(deleteOp);
        next();
    } catch (error) {
        console.log(error);
        next(error as CallbackError);
    }
})

const ClassMinistry = models?.ClassMinistry || model('ClassMinistry', ClassMinistrySchema);
export default ClassMinistry;