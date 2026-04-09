import mongoose from "mongoose";
declare class ApplicantsService {
    /**
     * Candidate Registry Retrieval:
     * Returns all profiles currently stored in the candidate registry for an owner.
     */
    getAllApplicants(ownerId?: string): Promise<any[]>;
    /**
     * Profile Detail Retrieval:
     * Returns a specific candidate profile by ID.
     */
    getApplicantById(id: string): Promise<(mongoose.Document<unknown, {}, import("../models/Applicant.model").IApplicant, {}, mongoose.DefaultSchemaOptions> & import("../models/Applicant.model").IApplicant & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    /**
     * Candidate Profile Initialization:
     * Adds a new technical profile to the candidate registry.
     */
    addApplicant(applicantData: any, ownerId: string): Promise<mongoose.Document<unknown, {}, import("../models/Applicant.model").IApplicant, {}, mongoose.DefaultSchemaOptions> & import("../models/Applicant.model").IApplicant & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Technical Registry Ingestion:
     * Parses PDF/CSV files into structured candidate profiles and saves them to the database.
     */
    ingestFromFilesWithOwner(files: Express.Multer.File[], ownerId: string, providedEmails?: string | string[]): Promise<any[]>;
    deleteApplicant(id: string): Promise<(mongoose.Document<unknown, {}, import("../models/Applicant.model").IApplicant, {}, mongoose.DefaultSchemaOptions> & import("../models/Applicant.model").IApplicant & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
declare const _default: ApplicantsService;
export default _default;
