import Job from "../models/Job.model";
import Screening from "../models/Screening.model";

class JobsService {
  /**
   * Job Registry Retrieval:
   * Returns all active job postings for a specific owner.
   */
  async getAllJobs(ownerId?: string) {
    if (!ownerId) return [];

    const jobs = await Job.find({ ownerId }).sort({ createdAt: -1 }).lean();

    // Add dynamic count from screenings
    const results = await Promise.all(
      jobs.map(async (job: any) => {
        const count = await Screening.countDocuments({
          jobId: job._id.toString(),
        });
        return { ...job, applicantsCount: count };
      }),
    );

    return results;
  }

  /**
   * Detail Matrix Retrieval:
   * Returns a specific job metric by ID.
   */
  async getJobById(id: string) {
    const job = await Job.findById(id).lean();
    if (!job) return null;

    const count = await Screening.countDocuments({ jobId: job._id.toString() });
    return { ...job, applicantsCount: count };
  }

  /**
   * Job Requirement Initialization:
   * Adds a new technical requirement to the database.
   */
  async createJob(jobData: any) {
    const newJob = new Job({
      ...jobData,
      applicantsCount: 0,
      status: "Active",
    });
    return await newJob.save();
  }

  /**
   * Update Judgement Criteria:
   * Modifies an existing technical requirement.
   */
  async updateJob(id: string, updatedData: any) {
    return await Job.findByIdAndUpdate(id, updatedData, { new: true });
  }

  async deleteJob(id: string) {
    return await Job.findByIdAndDelete(id);
  }
}

export default new JobsService();
