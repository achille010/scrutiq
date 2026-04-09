"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const Applicant_model_1 = __importDefault(require("../models/Applicant.model"));
const Screening_model_1 = __importDefault(require("../models/Screening.model"));
class ApplicantsService {
    /**
     * Candidate Registry Retrieval:
     * Returns all profiles currently stored in the candidate registry for an owner.
     */
    async getAllApplicants(ownerId) {
        if (!ownerId)
            return [];
        const applicants = await Applicant_model_1.default.find({ ownerId })
            .sort({ createdAt: -1 })
            .lean();
        // Check for screenings for each applicant
        const results = await Promise.all(applicants.map(async (app) => {
            const screeningCount = await Screening_model_1.default.countDocuments({
                candidateId: app._id.toString(),
            });
            return {
                ...app,
                isScreened: screeningCount > 0,
            };
        }));
        return results;
    }
    /**
     * Profile Detail Retrieval:
     * Returns a specific candidate profile by ID.
     */
    async getApplicantById(id) {
        return await Applicant_model_1.default.findById(id);
    }
    /**
     * Candidate Profile Initialization:
     * Adds a new technical profile to the candidate registry.
     */
    async addApplicant(applicantData, ownerId) {
        const newApp = new Applicant_model_1.default({
            ...applicantData,
            technicalProfile: applicantData.technicalProfile || "No profile data provided.",
            ownerId: ownerId || "global",
        });
        return await newApp.save();
    }
    /**
     * Technical Registry Ingestion:
     * Parses PDF/CSV files into structured candidate profiles and saves them to the database.
     */
    async ingestFromFilesWithOwner(files, ownerId, providedEmails) {
        const newApplicants = [];
        const emails = Array.isArray(providedEmails)
            ? providedEmails
            : [providedEmails];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const email = emails[i] ||
                `${file.originalname.toLowerCase().replace(".pdf", "").replace(/\s+/g, ".")}@registry.extern`;
            const ext = file.originalname.split(".").pop()?.toLowerCase();
            if (ext === "pdf") {
                try {
                    const data = await (0, pdf_parse_1.default)(file.buffer);
                    const name = file.originalname.replace(".pdf", "");
                    // Attempt to extract some info from the first lines
                    const textLines = data.text
                        .split("\n")
                        .filter((line) => line.trim().length > 0);
                    const possibleRole = textLines.length > 5
                        ? textLines.slice(0, 10).join(" ").substring(0, 50) + "..."
                        : "Technical Talent";
                    const applicant = new Applicant_model_1.default({
                        name,
                        email: email,
                        role: possibleRole,
                        location: "Remote / On-site",
                        experience: "Verified via Registry",
                        technicalProfile: data.text.substring(0, 1500),
                        resuméText: data.text,
                        ownerId,
                    });
                    await applicant.save();
                    newApplicants.push(applicant);
                }
                catch (error) {
                    console.error(`Fault in PDF extraction for ${file.originalname}:`, error);
                }
            }
        }
        return newApplicants;
    }
    async deleteApplicant(id) {
        return await Applicant_model_1.default.findByIdAndDelete(id);
    }
}
exports.default = new ApplicantsService();
//# sourceMappingURL=applicants.service.js.map