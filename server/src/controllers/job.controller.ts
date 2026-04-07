import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Job } from "../models/job.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
});

export const listJobs = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const search = (req.query.search as string | undefined)?.trim();

  const filter = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { summary: { $regex: search, $options: "i" } },
          { "requirements.skills": { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    data: jobs,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
  res.json(job);
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!job) throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
  res.json(job);
});
