"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jobs_service_1 = __importDefault(require("../services/jobs.service"));
class JobsController {
    /**
     * Technical Requirement Registry Retrieval:
     * Returns all active job postings in the recruiter registry.
     */
    async getAll(req, res) {
        try {
            const ownerId = req.headers["x-owner-id"];
            const jobs = await jobs_service_1.default.getAllJobs(ownerId);
            return res.status(200).json({ status: "success", data: jobs });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
    /**
     * Job Requirement Initialization:
     * Adds a new technical requirement to the registry.
     */
    async create(req, res) {
        try {
            const ownerId = req.headers["x-owner-id"] || "global";
            const newJob = await jobs_service_1.default.createJob({ ...req.body, ownerId });
            return res.status(201).json({
                status: "success",
                data: newJob,
            });
        }
        catch (error) {
            console.error("Job Creation Fault:", error);
            return res
                .status(500)
                .json({ status: "fault", message: "Failed to create job." });
        }
    }
    async updateJob(req, res) {
        try {
            const { id } = req.params;
            const updatedJob = await jobs_service_1.default.updateJob(id, req.body);
            if (!updatedJob) {
                return res
                    .status(404)
                    .json({ status: "fault", message: "Job Requirement not found." });
            }
            return res.status(200).json({
                status: "success",
                data: updatedJob,
            });
        }
        catch (error) {
            console.error("Job Update Fault:", error);
            return res
                .status(500)
                .json({
                status: "fault",
                message: "Failed to update technical requirement.",
            });
        }
    }
    /**
     * Detail Matrix Retrieval:
     * Returns a specific job metric by ID.
     */
    async getById(req, res) {
        try {
            const job = await jobs_service_1.default.getJobById(req.params.id);
            if (!job)
                return res
                    .status(404)
                    .json({ status: "fault", message: "Job Requirement Not Found." });
            return res.status(200).json({ status: "success", data: job });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await jobs_service_1.default.deleteJob(id);
            if (!deleted)
                return res
                    .status(404)
                    .json({ status: "fault", message: "Job Requirement Not Found." });
            return res
                .status(200)
                .json({
                status: "success",
                message: "Job Requirement deleted successfully.",
            });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
}
exports.default = new JobsController();
//# sourceMappingURL=jobs.controller.js.map