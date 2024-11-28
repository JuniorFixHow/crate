import { Document, model, models, Schema, Types } from "mongoose";
import { ISession } from "./session.model";
import { IMember } from "./member.model";

export interface IAttendance extends Document {
    _id:string;
    member:Types.ObjectId|string|IMember,
    late:'Yes'|'No',
    sessionId:Types.ObjectId|string|ISession,
    createdAt?: Date;
    updatedAt?: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
    member:{type:Schema.Types.ObjectId, ref:'Member', required:true},
    late:String,
    sessionId:{type:Schema.Types.ObjectId, ref:'Session', required:true},
},{timestamps:true})

const Attendance = models?.Attendance || model('Attendance', AttendanceSchema);
export default Attendance;