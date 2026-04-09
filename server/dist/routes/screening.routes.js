"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const screening_controller_1 = __importDefault(require("../controllers/screening.controller"));
const router = (0, express_1.Router)();
/**
 * TECHNICAL SCREENING ENDPOINTS
 * @access Recruiter-Facing Portal
 */
// Execute candidate ranking protocol
router.post("/execute", screening_controller_1.default.execute);
// Retrieve saved rankings for a job
router.get("/job/:jobId", screening_controller_1.default.getJobRankings);
// Remove specific ranking
router.delete("/:id", screening_controller_1.default.delete);
exports.default = router;
//# sourceMappingURL=screening.routes.js.map