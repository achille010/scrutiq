"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const applicants_service_1 = __importDefault(require("../services/applicants.service"));
class ApplicantsController {
    /**
     * Candidate Registry Retrieval:
     * Returns all profiles currently stored in the candidate registry.
     */
    async getAll(req, res) {
        try {
            const ownerId = req.headers["x-owner-id"];
            const applicants = await applicants_service_1.default.getAllApplicants(ownerId);
            return res.status(200).json({ status: "success", data: applicants });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
    /**
     * Talent Profile Ingestion:
     * Handles administrative PDF/CSV uploads to the registry.
     */
    async upload(req, res) {
        try {
            const files = req.files;
            const ownerId = req.headers["x-owner-id"] || "global";
            if (!files || files.length === 0) {
                return res.status(400).json({
                    status: "fault",
                    message: "No resumes provided for upload.",
                });
            }
            const emails = req.body.emails;
            const results = await applicants_service_1.default.ingestFromFilesWithOwner(files, ownerId, emails);
            return res.status(201).json({
                status: "success",
                message: `${results.length} candidate profiles successfully uploaded.`,
                data: results,
            });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
    /**
     * Candidate Profile Initialization:
     * Adds a new technical profile to the candidate registry.
     */
    async create(req, res) {
        try {
            const ownerId = req.headers["x-owner-id"] || "global";
            const applicant = await applicants_service_1.default.addApplicant(req.body, ownerId);
            return res.status(201).json({ status: "success", data: applicant });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
    /**
     * Profile Detail Retrieval:
     * Returns a specific candidate profile by ID.
     */
    async getById(req, res) {
        try {
            const applicant = await applicants_service_1.default.getApplicantById(req.params.id);
            if (!applicant)
                return res
                    .status(404)
                    .json({ status: "fault", message: "Candidate Profile Not Found." });
            return res.status(200).json({ status: "success", data: applicant });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const applicant = await applicants_service_1.default.deleteApplicant(req.params.id);
            if (!applicant)
                return res
                    .status(404)
                    .json({ status: "fault", message: "Candidate Profile Not Found." });
            return res
                .status(200)
                .json({ status: "success", message: "Candidate Profile Deleted." });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
}
exports.default = new ApplicantsController();
//# sourceMappingURL=applicants.controller.js.map