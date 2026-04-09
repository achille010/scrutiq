"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Job_model_1 = __importDefault(require("../models/Job.model"));
const Applicant_model_1 = __importDefault(require("../models/Applicant.model"));
const Screening_model_1 = __importDefault(require("../models/Screening.model"));
dotenv_1.default.config();
const DATA_DIR = path_1.default.join(__dirname, "../data");
const migrate = async () => {
    try {
        console.log("Starting Data Migration...");
        await mongoose_1.default.connect(process.env.MONGODB_URI || "");
        console.log("Connected to MongoDB.");
        // Migrate Users
        const usersPath = path_1.default.join(DATA_DIR, "users.json");
        if (fs_1.default.existsSync(usersPath)) {
            const users = JSON.parse(fs_1.default.readFileSync(usersPath, "utf8"));
            for (const u of users) {
                await User_model_1.default.findOneAndUpdate({ email: u.email }, u, { upsert: true });
            }
            console.log(`Migrated ${users.length} users.`);
        }
        // Migrate Jobs
        const jobsPath = path_1.default.join(DATA_DIR, "jobs.json");
        if (fs_1.default.existsSync(jobsPath)) {
            const jobs = JSON.parse(fs_1.default.readFileSync(jobsPath, "utf8"));
            for (const j of jobs) {
                // Handle ownerId if missing
                if (!j.ownerId)
                    j.ownerId = "USR-217"; // Default to Ishya for legacy data
                // Mongoose _id vs JOB-ID
                const { id, ...jobData } = j;
                await Job_model_1.default.findOneAndUpdate({ title: j.title, ownerId: j.ownerId }, jobData, { upsert: true });
            }
            console.log(`Migrated ${jobs.length} jobs.`);
        }
        // Migrate Applicants
        const appsPath = path_1.default.join(DATA_DIR, "applicants.json");
        if (fs_1.default.existsSync(appsPath)) {
            const applicants = JSON.parse(fs_1.default.readFileSync(appsPath, "utf8"));
            for (const a of applicants) {
                if (!a.ownerId)
                    a.ownerId = "USR-217";
                const { id, ...appData } = a;
                await Applicant_model_1.default.findOneAndUpdate({ email: a.email, ownerId: a.ownerId }, appData, { upsert: true });
            }
            console.log(`Migrated ${applicants.length} applicants.`);
        }
        // Migrate Screenings
        const screeningsPath = path_1.default.join(DATA_DIR, "screenings.json");
        if (fs_1.default.existsSync(screeningsPath)) {
            const screenings = JSON.parse(fs_1.default.readFileSync(screeningsPath, "utf8"));
            for (const s of screenings) {
                await Screening_model_1.default.findOneAndUpdate({ jobId: s.jobId, candidateId: s.candidateId }, s, { upsert: true });
            }
            console.log(`Migrated ${screenings.length} screenings.`);
        }
        console.log("Migration Successful.");
        process.exit(0);
    }
    catch (error) {
        console.error("Migration Error:", error);
        process.exit(1);
    }
};
migrate();
//# sourceMappingURL=migrateData.js.map