import { CallbackError, model, models, Schema, Types } from "mongoose";
import { IVendor } from "./vendor.model";
import Section, { ISection } from "./section.model";
import { IEvent } from "./event.model";
import Question from "./question.model";
import Response from "./response.model";

export interface ICYPSet extends Document{ 
    _id:string;
    createdBy:string|Types.ObjectId|IVendor;
    sections:ISection[]|[Types.ObjectId]|string[];
    published:boolean,
    eventId:IEvent|Types.ObjectId|string;
    title:string,
    createdAt?:Date;
    updatedAt?:Date; 
}


const CYPSetSchema =  new Schema<ICYPSet>({
    title:String,
    published:{type:Boolean, default:false},
    sections:[{type:Schema.Types.ObjectId, ref:'Section'}],
    eventId:{type:Schema.Types.ObjectId, ref:'Event', required:true},
    createdBy:{type:Schema.Types.ObjectId, ref:'Vendor', required:true},
},{timestamps:true})


CYPSetSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    try {
        const cypsetId = this.getQuery()?._id;
        if (!cypsetId) {
            throw new Error('CYPSet ID not found in query');
        }

        // Fetch related sections
        const sections = await Section.find({ cypsetId });

        // Collect delete operations for related questions and responses
        const deleteOperations = sections.flatMap((section: ISection) => [
            Question.deleteMany({ sectionId: section._id }),
            Response.deleteMany({ sectionId: section._id }),
        ]);

        // Add delete operation for all sections
        deleteOperations.push(Section.deleteMany({ cypsetId }));

        // Execute all delete operations in parallel
        await Promise.all(deleteOperations);

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Error in deleteOne middleware:', error);
        next(error as CallbackError);
    }
});



const CYPSet = models?.CYPSet || model('CYPSet', CYPSetSchema);
export default CYPSet