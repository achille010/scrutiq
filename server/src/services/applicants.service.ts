import mongoose from "mongoose";
import pdf from "pdf-parse";
import Applicant from "../models/Applicant.model";
import Screening from "../models/Screening.model";

class ApplicantsService {
  /**
   * Candidate Registry Retrieval:
   * Returns all profiles currently stored in the candidate registry for an owner.
   */
  async getAllApplicants(ownerId?: string) {
    if (!ownerId) return [];

    const applicants = await Applicant.find({ ownerId })
      .sort({ createdAt: -1 })
      .lean();

    // Check for screenings for each applicant
    const results = await Promise.all(
      applicants.map(async (app: any) => {
        const latestScreening = await Screening.findOne({
          candidateId: app._id.toString(),
        }).sort({ createdAt: -1 });
        return {
          ...app,
          isScreened: !!latestScreening,
          screening: latestScreening || null,
        };
      }),
    );

    return results;
  }

  /**
   * Profile Detail Retrieval:
   * Returns a specific candidate profile by ID.
   */
  async getApplicantById(id: string) {
    return await Applicant.findById(id);
  }

  /**
   * Candidate Profile Initialization:
   * Adds a new technical profile to the candidate registry.
   */
  async addApplicant(applicantData: any, ownerId: string) {
    const newApp = new Applicant({
      ...applicantData,
      technicalProfile:
        applicantData.technicalProfile || "No profile data provided.",
      ownerId: ownerId || "global",
    });
    return await newApp.save();
  }

  /**
   * Technical Registry Ingestion:
   * Parses PDF/CSV files into structured candidate profiles and saves them to the database.
   */
  async ingestFromFilesWithOwner(
    files: Express.Multer.File[],
    ownerId: string,
    providedEmails?: string | string[],
  ) {
    const newApplicants: any[] = [];
    const emails = Array.isArray(providedEmails)
      ? providedEmails
      : [providedEmails];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const email =
        emails[i] ||
        `${file.originalname.toLowerCase().replace(".pdf", "").replace(/\s+/g, ".")}@registry.extern`;

      const ext = file.originalname.split(".").pop()?.toLowerCase();
      if (ext === "pdf") {
        try {
          const data = await pdf(file.buffer);
          const name = file.originalname.replace(".pdf", "");

          // Attempt to extract some info from the first lines
          const textLines = data.text
            .split("\n")
            .filter((line) => line.trim().length > 0);
          const possibleRole =
            textLines.length > 5
              ? textLines.slice(0, 10).join(" ").substring(0, 50) + "..."
              : "Technical Talent";

          const applicant = new Applicant({
            name,
            email: email,
            role: possibleRole,
            location: "Remote / On-site",
            experience: "Verified via Registry",
            technicalProfile: data.text.substring(0, 1500),
            resuméText: data.text,
            ownerId,
          });

          await applicant.save();
          newApplicants.push(applicant);
        } catch (error) {
          console.error(
            `Fault in PDF extraction for ${file.originalname}:`,
            error,
          );
        }
      }
    }

    return newApplicants;
  }
  async deleteApplicant(id: string) {
    return await Applicant.findByIdAndDelete(id);
  }
}

export default new ApplicantsService();
