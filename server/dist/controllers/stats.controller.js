"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jobs_service_1 = __importDefault(require("../services/jobs.service"));
const applicants_service_1 = __importDefault(require("../services/applicants.service"));
class StatsController {
    /**
     * Technical System Stats Retrieval:
     * Returns high-level metrics across the entire recruitment registry.
     */
    async getSystemStats(req, res) {
        try {
            const ownerId = req.headers['x-owner-id'];
            const allJobs = await jobs_service_1.default.getAllJobs(ownerId);
            const allApplicants = await applicants_service_1.default.getAllApplicants(ownerId);
            const stats = {
                assessments: 0,
                activeJobs: allJobs.length,
                candidates: allApplicants.length,
                calibrationIndex: 100,
                recentActivity: []
            };
            return res.status(200).json({
                status: "success",
                data: stats,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            return res.status(500).json({
                status: "fault",
                message: error.message
            });
        }
    }
}
exports.default = new StatsController();
//# sourceMappingURL=stats.controller.js.map