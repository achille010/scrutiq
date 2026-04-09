import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  id: string; // Legacy ID support
  title: string;
  department: string;
  location: string;
  description: string;
  applicantsCount: number;
  status: "Active" | "Closed" | "Draft";
  ownerId: string;
}

const JobSchema: Schema = new Schema(
  {
    id: { type: String },
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    applicantsCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Closed", "Draft"], default: "Active" },
    ownerId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);
