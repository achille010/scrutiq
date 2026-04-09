"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Direct Route Imports (Matching the existing directory structure)
const jobs_routes_1 = __importDefault(require("./routes/jobs.routes"));
const applicants_routes_1 = __importDefault(require("./routes/applicants.routes"));
const screening_routes_1 = __importDefault(require("./routes/screening.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const app = (0, express_1.default)();
// Standard Technical Middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
// System Health Check Protocol
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "online",
        system: "Technical Portal API",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});
// API Routes Initialization
app.use("/api/jobs", jobs_routes_1.default);
app.use("/api/applicants", applicants_routes_1.default);
app.use("/api/screening", screening_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/stats", stats_routes_1.default);
// Global Error Handling Protocol
app.use((err, req, res, next) => {
    console.error("System Fault Detected:", err);
    res.status(err.status || 500).json({
        status: "fault",
        message: err.message || "Internal system technical error.",
        protocol: "Error-Handling-Module"
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map