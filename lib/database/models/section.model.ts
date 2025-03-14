import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import Question, { IQuestion } from "./question.model";
import Response, { IResponse } from "./response.model";
import { ICYPSet } from "./cypset.model";
import { IChurch } from "./church.model";

export interface ISection extends Document{
    _id:string,
    number:number,
    title:string,
    cypsetId:string | Types.ObjectId | ICYPSet;
    churchId:string | Types.ObjectId | IChurch;
    questions:IQuestion[]|[Types.ObjectId]|string[];
    responses:IResponse[]|[Types.ObjectId]|string[];
    createdAt?:Date,
    updatedAt?:Date
}

const SectionSchema = new Schema<ISection>({
    number:{type:Number, required:true},
    title:String,
    questions:[{type:Schema.Types.ObjectId, ref:'Question'}],
    responses:[{type:Schema.Types.ObjectId, ref:'Response'}],
    cypsetId:{type:Schema.Types.ObjectId, ref:'CYPSet', required:true},
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
},{timestamps:true});


SectionSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    try {
        const sectionId = this.getQuery()._id; // Access the _id from the query
        await Promise.all([
            Question.deleteMany({ sectionId }),
            Response.deleteMany({ sectionId }),
        ]);
        next();
    } catch (error) {
        next(error as CallbackError);
        console.log(error);
    }
});



const Section = models?.Section || model('Section', SectionSchema);
export default Section;