import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { ISection } from "./section.model";
import Response from "./response.model";

export interface IQuestion extends Document{ 
    _id:string;
    id: string; 
    label: string; 
    type: string; 
    options?: string[];
    sectionId:string|Types.ObjectId|ISection;
    createdAt:Date;
    updatedAt:Date; 
}


const QuestionSchema =  new Schema<IQuestion>({
    id:String,
    label:String,
    type:String,
    options:[String],
    sectionId:{type:Schema.Types.ObjectId, ref:'Section'},
},{timestamps:true})


QuestionSchema.pre('deleteOne', {document:false, query:true}, async function(next){
    try {
        const questionId = this.getQuery()._id;
        await Response.deleteMany({questionId});
        next();
        
    } catch (error) {
        console.log(error);
        next(error as CallbackError)
    }
})

const Question = models?.Question || model('Question', QuestionSchema);
export default Question