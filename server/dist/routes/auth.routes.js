"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = (0, express_1.Router)();
/**
 * USER ACCESS ROUTES
 * Simple endpoints for signing up and logging in.
 */
// Create a new account
router.post("/register", auth_controller_1.default.register);
// Login to existing account
router.post("/login", auth_controller_1.default.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map