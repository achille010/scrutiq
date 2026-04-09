"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Job_model_1 = __importDefault(require("../models/Job.model"));
const Screening_model_1 = __importDefault(require("../models/Screening.model"));
class JobsService {
    /**
     * Job Registry Retrieval:
     * Returns all active job postings for a specific owner.
     */
    async getAllJobs(ownerId) {
        if (!ownerId)
            return [];
        const jobs = await Job_model_1.default.find({ ownerId }).sort({ createdAt: -1 }).lean();
        // Add dynamic count from screenings
        const results = await Promise.all(jobs.map(async (job) => {
            const count = await Screening_model_1.default.countDocuments({
                jobId: job._id.toString(),
            });
            return { ...job, applicantsCount: count };
        }));
        return results;
    }
    /**
     * Detail Matrix Retrieval:
     * Returns a specific job metric by ID.
     */
    async getJobById(id) {
        const job = await Job_model_1.default.findById(id).lean();
        if (!job)
            return null;
        const count = await Screening_model_1.default.countDocuments({ jobId: job._id.toString() });
        return { ...job, applicantsCount: count };
    }
    /**
     * Job Requirement Initialization:
     * Adds a new technical requirement to the database.
     */
    async createJob(jobData) {
        const newJob = new Job_model_1.default({
            ...jobData,
            applicantsCount: 0,
            status: "Active",
        });
        return await newJob.save();
    }
    /**
     * Update Judgement Criteria:
     * Modifies an existing technical requirement.
     */
    async updateJob(id, updatedData) {
        return await Job_model_1.default.findByIdAndUpdate(id, updatedData, { new: true });
    }
    async deleteJob(id) {
        return await Job_model_1.default.findByIdAndDelete(id);
    }
}
exports.default = new JobsService();
//# sourceMappingURL=jobs.service.js.map