import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Direct Route Imports (Matching the existing directory structure)
import jobRoutes from "./routes/jobs.routes";
import applicantRoutes from "./routes/applicants.routes";
import screeningRoutes from "./routes/screening.routes";
import authRoutes from "./routes/auth.routes";
import statsRoutes from "./routes/stats.routes";

const app: Express = express();

// Standard Technical Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// System Health Check Protocol
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "online", 
    system: "Technical Portal API", 
    version: "1.0.0",
    timestamp: new Date().toISOString() 
  });
});

// API Routes Initialization
app.use("/api/jobs", jobRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api/screening", screeningRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);

// Global Error Handling Protocol
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("System Fault Detected:", err);
  res.status(err.status || 500).json({
    status: "fault",
    message: err.message || "Internal system technical error.",
    protocol: "Error-Handling-Module"
  });
});

export default app;
