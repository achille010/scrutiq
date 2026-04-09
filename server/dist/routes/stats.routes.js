"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = __importDefault(require("../controllers/stats.controller"));
const router = (0, express_1.Router)();
/**
 * TECHNICAL SYSTEM METRICS ENDPOINTS
 * @access Recruiter-Facing Portal
 */
// Retrieve global system stats
router.get("/", stats_controller_1.default.getSystemStats);
exports.default = router;
//# sourceMappingURL=stats.routes.js.map