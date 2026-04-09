import { Request, Response } from "express";
import applicantsService from "../services/applicants.service";

class ApplicantsController {
  /**
   * Candidate Registry Retrieval:
   * Returns all profiles currently stored in the candidate registry.
   */
  async getAll(req: Request, res: Response) {
    try {
      const ownerId = req.headers["x-owner-id"] as string | undefined;
      const applicants = await applicantsService.getAllApplicants(ownerId);
      return res.status(200).json({ status: "success", data: applicants });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  /**
   * Talent Profile Ingestion:
   * Handles administrative PDF/CSV uploads to the registry.
   */
  async upload(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const ownerId = (req.headers["x-owner-id"] as string) || "global";
      if (!files || files.length === 0) {
        return res.status(400).json({
          status: "fault",
          message: "No resumes provided for upload.",
        });
      }

      const emails = req.body.emails;
      const results = await applicantsService.ingestFromFilesWithOwner(
        files,
        ownerId,
        emails,
      );
      return res.status(201).json({
        status: "success",
        message: `${results.length} candidate profiles successfully uploaded.`,
        data: results,
      });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  /**
   * Candidate Profile Initialization:
   * Adds a new technical profile to the candidate registry.
   */
  async create(req: Request, res: Response) {
    try {
      const ownerId = (req.headers["x-owner-id"] as string) || "global";
      const applicant = await applicantsService.addApplicant(req.body, ownerId);
      return res.status(201).json({ status: "success", data: applicant });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  /**
   * Profile Detail Retrieval:
   * Returns a specific candidate profile by ID.
   */
  async getById(req: Request, res: Response) {
    try {
      const applicant = await applicantsService.getApplicantById(req.params.id);
      if (!applicant)
        return res
          .status(404)
          .json({ status: "fault", message: "Candidate Profile Not Found." });
      return res.status(200).json({ status: "success", data: applicant });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const applicant = await applicantsService.deleteApplicant(req.params.id);
      if (!applicant)
        return res
          .status(404)
          .json({ status: "fault", message: "Candidate Profile Not Found." });
      return res
        .status(200)
        .json({ status: "success", message: "Candidate Profile Deleted." });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  async sendEmail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { subject, message, recipientEmail } = req.body;
      const applicant = await applicantsService.getApplicantById(id);
      
      if (!applicant) {
        return res.status(404).json({ status: "fault", message: "Applicant not found." });
      }

      const emailService = (await import("../services/email.service")).default;
      const targetEmail = recipientEmail || applicant.email;
      await emailService.sendCustomEmail(targetEmail, subject, message);

      return res.status(200).json({ status: "success", message: "Email dispatched successfully." });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }
}

export default new ApplicantsController();
