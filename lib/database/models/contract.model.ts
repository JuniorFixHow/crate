import { Document, model, models, Schema } from "mongoose";
import Church from "./church.model";

export interface IContract extends Document{
    _id:string;
    title:string;
    church:string;
    date:{
        from:string;
        to:string;
    };
    offeree:{
        name:string,
        sign:string,
    };
    witness:{
        name:string,
        sign:string,
    };
    amount:number;
    description:string;
    createdAt:Date;
    updatedAt:Date;
};

const ContractSchema = new Schema<IContract>({
    title:String,
    church:String,
    description:String,
    date:{from:String, to:String},
    offeree:{name:String, sign:String},
    witness:{name:String, sign:String},
    amount:Number
}, {timestamps:true});

ContractSchema.pre('deleteOne', {document:false, query:true}, async function(next){
    try {
        const contractId = this.getQuery()._id;
        await Church.updateMany({contractId}, {$unset:{contractId:""}});
        next();
    } catch (error) {
        console.log(error);
    }
})

const Contract = models?.Contract || model<IContract>('Contract', ContractSchema);

export default Contract;