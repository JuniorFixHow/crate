import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { ICYPSet } from "./cypset.model";
import { IQuestion } from "./question.model";
import { ISection } from "./section.model";

export interface IResponse extends Document{ 
    _id:string;
    answer: string; 
    type: string; 
    options?: string[];
    questionId:string|Types.ObjectId|IQuestion;
    cypsetId:string|Types.ObjectId|ICYPSet;
    sectionId:string|Types.ObjectId|ISection;
    memberId:string|Types.ObjectId|IMember;
    createdAt?:Date;
    updatedAt?:Date; 
}


const ResponseSchema =  new Schema<IResponse>({
    answer:String,
    type:String,
    options:[String],
    memberId:{type:Schema.Types.ObjectId, ref:'Member', required:true},
    cypsetId:{type:Schema.Types.ObjectId, ref:'CYPSet'},
    sectionId:{type:Schema.Types.ObjectId, ref:'Section'},
    questionId:{type:Schema.Types.ObjectId, ref:'Question', required:true}
},{timestamps:true})


const Response = models?.Response || model('Response', ResponseSchema);
export default Response