import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import Room from "./room.model";
import Key from "./key.model";
import Facility, { IFacility } from "./facility.model";
import { IChurch } from "./church.model";


export interface IVenue extends Document{
    _id:string;
    name:string;
    location:string;
    type:string;
    facilities:string[]|IFacility[]|Types.ObjectId[];
    churchId:string|IChurch[]|Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const VenueSchema = new Schema<IVenue>({
    name:String,
    location:String,
    type:String,
    facilities:[{type:Schema.Types.ObjectId, ref:'Facility'}],
    churchId:{type:Schema.Types.ObjectId, ref:'Church'},
}, {timestamps:true});

VenueSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    try {
        const venueId = this.getQuery()._id;

        if (!venueId) {
            throw new Error('Venue ID is required for deletion.');
        }

        // Fetch all facilities associated with the venue
        const facilities = await Facility.find({ venueId });

        // Collect delete operations for facilities, rooms, and keys
        const deleteOperations = [];

        // Iterate through facilities to handle cascading deletions
        for (const facility of facilities) {
            // Delete all rooms associated with the facility
            const rooms = await Room.find({ facId: facility._id });
            const deleteRoomKeys = rooms.map(room => Key.deleteMany({ roomId: room._id }));

            // Add room deletions to operations
            deleteOperations.push(...deleteRoomKeys);
            deleteOperations.push(Room.deleteMany({ facId: facility._id }));
        }

        // Delete all facilities associated with the venue
        deleteOperations.push(Facility.deleteMany({ venueId }));

        // Execute all delete operations
        await Promise.all(deleteOperations);

        // Finally, proceed to delete the venue
        next();
    } catch (error) {
        console.error('Error during Venue deletion cascade:', error);
        next(error as CallbackError);
    }
});


const Venue = models?.Venue || model('Venue', VenueSchema);
export default Venue;