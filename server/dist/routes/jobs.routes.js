"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobs_controller_1 = __importDefault(require("../controllers/jobs.controller"));
const router = (0, express_1.Router)();
/**
 * TECHNICAL REQUIREMENT REGISTRY ENDPOINTS
 * @access Recruiter-Facing Portal
 */
// List all active requirements
router.get("/", jobs_controller_1.default.getAll);
// Detail Matrix Retrieval
router.get("/:id", jobs_controller_1.default.getById);
// Job Requirement Initialization
router.post("/", jobs_controller_1.default.create);
// Update Judgement Criteria
router.put("/:id", jobs_controller_1.default.updateJob);
// Remove Job Requirement
router.delete("/:id", jobs_controller_1.default.delete);
exports.default = router;
//# sourceMappingURL=jobs.routes.js.map