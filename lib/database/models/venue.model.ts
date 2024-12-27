import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import Room, { IRoom } from "./room.model";
import { IKey } from "./key.model";

export type HallProps = {name:string, rooms:number, floors:number}

export interface IVenue extends Document{
    _id:string;
    name:string;
    loaction:string;
    type:string;
    facilities:HallProps[];
    rooms:string[]|IRoom[]|Types.ObjectId[];
    keys:string[]|IKey[]|Types.ObjectId[];
    createdAt:Date;
    updatedAt:Date;
}

const VenueSchema = new Schema<IVenue>({
    name:String,
    loaction:String,
    type:String,
    facilities:[{name:String, rooms:Number, floors:Number}],
    rooms:[{type:Schema.Types.ObjectId, ref:'Room'}],
    keys:[{type:Schema.Types.ObjectId, ref:'Key'}],
}, {timestamps:true});

VenueSchema.pre('deleteOne', {document:false, query:true}, async function(next){
    try {
        const venueId = this.getQuery()._id;
        await Room.deleteMany({venueId});
        next();
    } catch (error) {
        console.log(error);
        next(error as CallbackError)
    }
})

const Venue = models?.Venue || model('Venue', VenueSchema);
export default Venue;