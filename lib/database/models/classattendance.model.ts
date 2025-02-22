import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IClasssession } from "./classsession.model";

export interface ICAttendance extends Document {
    _id:string;
    member:Types.ObjectId|string|IMember,
    late:'Yes'|'No',
    sessionId:Types.ObjectId|string|IClasssession,
    createdAt?: Date;
    updatedAt?: Date;
}

const AttendanceSchema = new Schema<ICAttendance>({
    member:{type:Schema.Types.ObjectId, ref:'Member', required:true},
    late:String,
    sessionId:{type:Schema.Types.ObjectId, ref:'CSession', required:true},
},{timestamps:true})

const CAttendance = models?.CAttendance || model('CAttendance', AttendanceSchema);
export default CAttendance;