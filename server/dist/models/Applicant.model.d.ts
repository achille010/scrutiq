import mongoose, { Document } from "mongoose";
export interface IApplicant extends Document {
    name: string;
    role: string;
    location: string;
    experience: string;
    email: string;
    technicalProfile: string;
    resuméText?: string;
    profileStatus: "Verified" | "Pending" | "Archived";
    ownerId: string;
}
declare const _default: mongoose.Model<IApplicant, {}, {}, {}, mongoose.Document<unknown, {}, IApplicant, {}, mongoose.DefaultSchemaOptions> & IApplicant & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IApplicant>;
export default _default;
