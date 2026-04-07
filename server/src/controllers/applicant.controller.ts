import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { Applicant } from "../models/applicant.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["text/csv", "application/vnd.ms-excel"];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith(".csv")) {
      return cb(null, true);
    }
    cb(new ApiError(StatusCodes.BAD_REQUEST, "Only CSV files are allowed"));
  },
});
export const uploadMiddleware = upload.single("file");

export const createApplicant = asyncHandler(async (req: Request, res: Response) => {
  const applicant = await Applicant.create(req.body);
  res.status(StatusCodes.CREATED).json(applicant);
});

export const listApplicants = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const search = (req.query.search as string | undefined)?.trim();

  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { "profile.skills": { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const total = await Applicant.countDocuments(filter);
  const applicants = await Applicant.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    data: applicants,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

export const uploadApplicants = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file?.buffer && !req.file?.path) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded");
  }

  const csvBuffer = (req.file as Express.Multer.File & { buffer?: Buffer }).buffer;
  const fileContent = csvBuffer?.toString("utf-8") || "";

  if (!fileContent) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to read uploaded file");
  }

  let records: any[];
  try {
    records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (err) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "CSV parse failed", err);
  }

  const errors: string[] = [];
  const docs = records.map((row: any, idx: number) => {
    const skills = row.skills ? row.skills.split("|").map((s: string) => s.trim()).filter(Boolean) : [];
    const yoe = Number(row.yearsOfExperience || row.yoe || 0);
    if (!row.name) errors.push(`Row ${idx + 2}: name is required`);
    if (!row.email) errors.push(`Row ${idx + 2}: email is required`);
    if (!skills.length) errors.push(`Row ${idx + 2}: skills must not be empty`);
    if (Number.isNaN(yoe)) errors.push(`Row ${idx + 2}: yearsOfExperience must be a number`);

    return {
      name: row.name,
      email: row.email,
      phone: row.phone,
      jobIds: row.jobIds ? row.jobIds.split("|").filter(Boolean) : [],
      profile: {
        headline: row.headline || row.role || "Candidate",
        yearsOfExperience: Number.isNaN(yoe) ? 0 : yoe,
        skills,
        education: row.education,
        certifications: row.certifications
          ? row.certifications.split("|").map((c: string) => c.trim()).filter(Boolean)
          : [],
        languages: row.languages
          ? row.languages.split("|").map((l: string) => l.trim()).filter(Boolean)
          : [],
        location: row.location,
        desiredRole: row.desiredRole || row.role,
        seniority: row.seniority,
        resumeUrl: row.resumeUrl,
      },
    };
  });

  if (errors.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "CSV validation failed", errors);
  }

  const inserted = await Applicant.insertMany(docs);
  res.status(StatusCodes.CREATED).json({ inserted: inserted.length });
});
