"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicants_controller_1 = __importDefault(require("../controllers/applicants.controller"));
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
/**
 * CANDIDATE REGISTRY ENDPOINTS
 * @access Recruiter-Facing Portal
 */
// List all candidates
router.get("/", applicants_controller_1.default.getAll);
// Profile Detail Retrieval
router.get("/:id", applicants_controller_1.default.getById);
// Remove Profile
router.delete("/:id", applicants_controller_1.default.delete);
// Candidate Profile Initialization (Manual)
router.post("/", applicants_controller_1.default.create);
/**
 * TALENT INGESTION PROTOCOL
 * Handles administrative PDF/CSV uploads to the registry.
 */
router.post("/upload", upload_middleware_1.upload.array("dossiers", 20), applicants_controller_1.default.upload);
exports.default = router;
//# sourceMappingURL=applicants.routes.js.map