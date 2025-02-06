import { Document, model, models, Schema, Types } from "mongoose";
import { IMember } from "./member.model";
import { IClassministry } from "./classministry.model";
import { IChurch } from "./church.model";

export interface IMinistryrole extends Document{
    _id:string;
    title:string;
    minId: string | IClassministry | Types.ObjectId;
    churchId: string | IChurch | Types.ObjectId;
    memberId: string | IMember | Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const MinistryroleSchema = new Schema<IMinistryrole>({
    title:String,
    minId: {type:Schema.Types.ObjectId, ref:'ClassMinistry'},
    memberId: {type:Schema.Types.ObjectId, ref:'Member'},
    churchId: {type:Schema.Types.ObjectId, ref:'Church'},
}, {timestamps:true});

const Ministryrole = models?.Ministryrole || model('Ministryrole', MinistryroleSchema);
export default Ministryrole;