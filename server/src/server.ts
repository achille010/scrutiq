import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";

// Load environment variables
dotenv.config();

// Initialize Database Connection
connectDB();

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "development";

const server = app.listen(port, () => {
  console.log(`
  🚀 TECHNICAL PORTAL API INITIALIZED
  🚀 PORT: ${port}
  🚀 ENVIRONMENT: ${environment}
  🚀 CLOUD READINESS: OK
  `);
});

// System Termination Protocol
const shutdown = () => {
  console.log("Cleanup Protocol Initiated. Closing system resources...");
  server.close(() => {
    console.log("System Process Finalized.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Technical Rejection:", err);
  process.exit(1);
});
