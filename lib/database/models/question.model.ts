import { Document, model, models, Schema, Types } from "mongoose";
import { ICYPSet } from "./cypset.model";

export interface IQuestion extends Document{ 
    _id:string;
    id: string; 
    label: string; 
    type: string; 
    options?: string[];
    cypsetId:string|Types.ObjectId|ICYPSet;
    createdAt?:Date;
    updatedAt?:Date; 
}


const QuestionSchema =  new Schema<IQuestion>({
    id:String,
    label:String,
    type:String,
    options:[String],
    cypsetId:{type:Schema.Types.ObjectId, ref:'CPYSet'},
},{timestamps:true})


const Question = models?.Question || model('Question', QuestionSchema);
export default Question