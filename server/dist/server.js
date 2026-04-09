"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
// Load environment variables
dotenv_1.default.config();
// Initialize Database Connection
(0, db_1.default)();
const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "development";
const server = app_1.default.listen(port, () => {
    console.log(`
  🚀 TECHNICAL PORTAL API INITIALIZED
  🚀 PORT: ${port}
  🚀 ENVIRONMENT: ${environment}
  🚀 CLOUD READINESS: OK
  `);
});
// System Termination Protocol
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Cleaning up system resources...");
    server.close(() => {
        console.log("System Process Finalized.");
    });
});
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Technical Rejection:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map