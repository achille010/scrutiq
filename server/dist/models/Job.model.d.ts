import mongoose, { Document } from "mongoose";
export interface IJob extends Document {
    title: string;
    department: string;
    location: string;
    description: string;
    applicantsCount: number;
    status: "Active" | "Closed" | "Draft";
    ownerId: string;
}
declare const _default: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, mongoose.DefaultSchemaOptions> & IJob & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IJob>;
export default _default;
