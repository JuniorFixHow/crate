import { CallbackError, model, models, Types } from "mongoose";
import { Document, Schema } from "mongoose";
import { IEvent } from "./event.model";
import { IVenue } from "./venue.model";
import Key from "./key.model";
import { IFacility } from "./facility.model";
import { IChurch } from "./church.model";

export interface IRoom extends Document {
    _id:string;
    floor?:string,
    number?:string,
    nob?:number,
    venueId:string|Types.ObjectId|IVenue;
    facId:string|Types.ObjectId|IFacility;
    roomType?:string,
    bedType?:string,
    features?:string,
    eventId:Types.ObjectId | string | IEvent,
    churchId:Types.ObjectId | string | IChurch,
    createdAt?:Date,
    updatedAt?:Date,
}

const RoomSchema = new Schema<IRoom>({
    floor:String,
    number:String,
    nob:{type:Number, default:1},
    roomType:String,
    bedType:String,
    features:String,
    eventId:{type:Schema.Types.ObjectId, ref:'Event', required:true},
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
    venueId:{type:Schema.Types.ObjectId, ref:'Venue', required:true},
    facId:{type:Schema.Types.ObjectId, ref:'Facility', required:true}
},{timestamps:true})


RoomSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    try {
        const roomId = this.getQuery()._id;

        if (!roomId) {
            throw new Error('Room ID is required for deletion.');
        }

        // Delete all keys associated with the room
        await Key.deleteMany({ roomId });

        // Proceed to delete the room
        next();
    } catch (error) {
        console.error('Error during Room deletion cascade:', error);
        next(error as CallbackError);
    }
});




const Room = models?.Room || model('Room', RoomSchema);
export default Room;