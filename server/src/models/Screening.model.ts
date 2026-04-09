import mongoose, { Schema, Document } from "mongoose";

export interface IScreening extends Document {
  jobId: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  matchScore: number;
  strengths: string[];
  gaps: string[];
  finalRecommendation: "Priority Alignment" | "Technical Fit" | "Potential Fit" | "No Alignment";
  reasoning: string;
}

const ScreeningSchema: Schema = new Schema(
  {
    jobId: { type: String, required: true },
    candidateId: { type: String, required: true },
    candidateName: { type: String },
    candidateEmail: { type: String },
    matchScore: { type: Number, required: true },
    strengths: [{ type: String }],
    gaps: [{ type: String }],
    finalRecommendation: { 
      type: String, 
      enum: ["Priority Alignment", "Technical Fit", "Potential Fit", "No Alignment"],
      required: true 
    },
    reasoning: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IScreening>("Screening", ScreeningSchema);
