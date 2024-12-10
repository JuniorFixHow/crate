import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { ICYPSet } from "./cypset.model";
import { IQuestion } from "./question.model";

export interface IResponse extends Document{ 
    _id:string;
    answer: string; 
    type: string; 
    options?: string[];
    questionId:string|Types.ObjectId|IQuestion;
    cypsetId:string|Types.ObjectId|ICYPSet;
    memberId:string|Types.ObjectId|IMember;
    createdAt?:Date;
    updatedAt?:Date; 
}


const ResponseSchema =  new Schema<IResponse>({
    id:String,
    answer:String,
    type:String,
    options:[String],
    memberId:{type:Schema.Types.ObjectId, ref:'Member', required:true},
    cypsetId:{type:Schema.Types.ObjectId, ref:'CPYSet'},
    questionId:{type:Schema.Types.ObjectId, ref:'Question', required:true}
},{timestamps:true})


const Response = models?.Response || model('Response', ResponseSchema);
export default Response