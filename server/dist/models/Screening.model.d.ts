import mongoose, { Document } from "mongoose";
export interface IScreening extends Document {
    jobId: string;
    candidateId: string;
    matchScore: number;
    strengths: string[];
    gaps: string[];
    finalRecommendation: "Priority Alignment" | "Technical Fit" | "Potential Fit" | "No Alignment";
    reasoning: string;
}
declare const _default: mongoose.Model<IScreening, {}, {}, {}, mongoose.Document<unknown, {}, IScreening, {}, mongoose.DefaultSchemaOptions> & IScreening & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IScreening>;
export default _default;
