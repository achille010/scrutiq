import mongoose from "mongoose";
declare class ScreeningService {
    getRankingsByJob(jobId: string): Promise<any[]>;
    /**
     * Technical Screening Protocol:
     * Orchestrates the candidate ranking process using the Gemini AI service.
     */
    executeScreening(jobId: string, candidateIds: string[], ownerId: string): Promise<(mongoose.Document<unknown, {}, import("../models/Screening.model").IScreening, {}, mongoose.DefaultSchemaOptions> & import("../models/Screening.model").IScreening & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deleteScreening(id: string): Promise<(mongoose.Document<unknown, {}, import("../models/Screening.model").IScreening, {}, mongoose.DefaultSchemaOptions> & import("../models/Screening.model").IScreening & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
declare const _default: ScreeningService;
export default _default;
