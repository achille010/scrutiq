import mongoose from "mongoose";
import Screening from "../models/Screening.model";
import geminiService from "./gemini.service";
import jobsService from "./jobs.service";
import applicantsService from "./applicants.service";

class ScreeningService {
  async getRankingsByJob(jobId: string) {
    const rankings = await Screening.find({ jobId })
      .sort({ matchScore: -1 })
      .lean();

    // Enrich with applicant data (email, real name if missing)
    const enriched = await Promise.all(
      rankings.map(async (rank: any) => {
        // Improved lookup: Check both _id and legacy id field
        const applicant = (await mongoose
          .model("Applicant")
          .findOne({
            $or: [
              mongoose.isValidObjectId(rank.candidateId) ? { _id: rank.candidateId } : { _id: null },
              { id: rank.candidateId }
            ].filter(query => Object.values(query)[0] !== null)
          })
          .lean()) as any;
        return {
          ...rank,
          candidateName:
            applicant?.name || rank.candidateName || "Technical Candidate",
          candidateEmail: applicant?.email || "No email available",
          candidateResume: applicant?.resume || null,
        };
      }),
    );

    return enriched;
  }

  /**
   * Technical Screening Protocol:
   * Orchestrates the candidate ranking process using the Gemini AI service.
   */
  async executeScreening(
    jobId: string,
    candidateIds: string[],
    ownerId: string,
  ) {
    // 1. Requirement Matrix Retrieval
    const job = await jobsService.getJobById(jobId);
    if (!job) throw new Error("Job Requirement Registry Fault: Job not found.");

    // 2. Candidate Registry Retrieval
    // We need to get ONLY applicants for this owner to ensure isolation
    const allApplicants = await applicantsService.getAllApplicants(ownerId);
    const targetCandidates = allApplicants.filter((app) =>
      candidateIds.includes(app._id?.toString() || app.id),
    );

    if (targetCandidates.length === 0) {
      throw new Error(
        `Candidate Registry Fault: No eligible profiles for screening.`,
      );
    }

    // 3. AI Execution Protocol
    console.log(
      `Executing AI Alignment Protocol for Job ${jobId} against ${targetCandidates.length} candidates...`,
    );
    const results = await geminiService.screenCandidates(job, targetCandidates);

    // 4. Result Finalization & Persistence
    const savedResults = [];
    for (const result of results) {
      const candidateId = result.candidateId;

      // Update the Applicant record with AI-extracted data for better registry quality
      if (
        result.candidateEmail ||
        result.candidateName ||
        result.microSummary
      ) {
        await mongoose.model("Applicant").findByIdAndUpdate(candidateId, {
          name: result.candidateName,
          email: result.candidateEmail,
          experience: result.microSummary,
        });
      }

      // Upsert the results based on jobId and candidateId
      const screeningResult = await Screening.findOneAndUpdate(
        { jobId, candidateId },
        {
          ...result,
          jobId,
          candidateName: result.candidateName || "Unknown Candidate",
        },
        { upsert: true, new: true },
      );
      savedResults.push(screeningResult);
    }

    return savedResults;
  }

  async deleteScreening(id: string) {
    return await Screening.findByIdAndDelete(id);
  }
}

export default new ScreeningService();
