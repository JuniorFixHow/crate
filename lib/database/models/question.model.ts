import { Document, model, models, Schema, Types } from "mongoose";
import { ISection } from "./section.model";

export interface IQuestion extends Document{ 
    _id:string;
    id: string; 
    label: string; 
    type: string; 
    options?: string[];
    sectionId:string|Types.ObjectId|ISection;
    createdAt?:Date;
    updatedAt?:Date; 
}


const QuestionSchema =  new Schema<IQuestion>({
    id:String,
    label:String,
    type:String,
    options:[String],
    sectionId:{type:Schema.Types.ObjectId, ref:'Section'},
},{timestamps:true})


const Question = models?.Question || model('Question', QuestionSchema);
export default Question