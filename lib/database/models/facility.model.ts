import { CallbackError, Document, model, models, Schema, Types } from "mongoose";
import { IVenue } from "./venue.model";
import Room from "./room.model";
import Key from "./key.model";
import { IChurch } from "./church.model";

export interface IFacility extends Document{
    _id:string,
    name:string, 
    rooms:number, 
    floor:number,
    venueId:string|Types.ObjectId|IVenue,
    churchId:string|Types.ObjectId|IChurch,
    createdAt:Date,
    updatedAt:Date,
}

const FacilitySchema = new Schema<IFacility>({
    name: String,
    rooms: String,
    floor: Number,
    venueId: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
    churchId: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
}, { timestamps: true });

FacilitySchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    try {
        const facilityId = this.getQuery()._id;

        if (!facilityId) {
            throw new Error('Facility ID is required for deletion.');
        }

        // Fetch all rooms associated with the facility
        const rooms = await Room.find({ facId: facilityId });

        // Collect delete operations for rooms and keys
        const deleteOperations = rooms.map(room => Key.deleteMany({ roomId: room._id }));
        deleteOperations.push(Room.deleteMany({ facId: facilityId }));

        // Execute all delete operations
        await Promise.all(deleteOperations);

        // Proceed to delete the facility
        next();
    } catch (error) {
        console.error('Error during Facility deletion cascade:', error);
        next(error as CallbackError);
    }
});


const Facility = models?.Facility || model('Facility', FacilitySchema);
export default Facility;