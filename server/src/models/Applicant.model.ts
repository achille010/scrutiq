import mongoose, { Schema, Document } from "mongoose";

export interface IApplicant extends Document {
  id: string; // Legacy ID support
  name: string;
  role: string;
  location: string;
  experience: string;
  email: string;
  technicalProfile: string;
  resuméText?: string;
  profileStatus: "Verified" | "Pending" | "Archived";
  ownerId: string;
}

const ApplicantSchema: Schema = new Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    experience: { type: String, required: true },
    email: { type: String, required: true },
    technicalProfile: { type: String, required: true },
    resuméText: { type: String },
    profileStatus: { type: String, enum: ["Verified", "Pending", "Archived"], default: "Pending" },
    ownerId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IApplicant>("Applicant", ApplicantSchema);
