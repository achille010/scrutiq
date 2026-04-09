declare class JobsService {
    /**
     * Job Registry Retrieval:
     * Returns all active job postings for a specific owner.
     */
    getAllJobs(ownerId?: string): Promise<any[]>;
    /**
     * Detail Matrix Retrieval:
     * Returns a specific job metric by ID.
     */
    getJobById(id: string): Promise<{
        applicantsCount: number;
        title: string;
        department: string;
        location: string;
        description: string;
        status: "Active" | "Closed" | "Draft";
        ownerId: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    } | null>;
    /**
     * Job Requirement Initialization:
     * Adds a new technical requirement to the database.
     */
    createJob(jobData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/Job.model").IJob, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Job.model").IJob & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Update Judgement Criteria:
     * Modifies an existing technical requirement.
     */
    updateJob(id: string, updatedData: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/Job.model").IJob, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Job.model").IJob & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteJob(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Job.model").IJob, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Job.model").IJob & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
declare const _default: JobsService;
export default _default;
